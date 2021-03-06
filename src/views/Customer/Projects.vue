<template>
  <b-container fluid class="container-app">
    <Header
      title="PROJECT LIST"
      subtitle="List of your current and past projects in GMF AeroAsia (please kindly give rating/review for the finished projects)"
    />

    <b-row data-intro="You can filter the Project list">
      <b-col cols="6" md="2" class="mb-3 mb-md-0">
        <b-form-select v-model="selectVal.location" :options="locationOptions" />
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.project_type" :options="typeOptions" />
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.status" :options="statusOptions" />
      </b-col>
      <b-col cols="6" md="3">
        <b-row>
          <b-col cols="0" md="8" class="d-none d-md-block">
            <p class="per-page-text " style="text-align: right">Items per page</p>
          </b-col>
          <b-col cols="12" md="4">
            <b-form-select v-model="perPage" :options="perPageOptions" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="projectFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showProjectDetail"
      show-empty
      empty-text=""
      data-intro="Show all of your Current project with Garuda Maintenance Facility. You can sort by pressing the arrow up and arrow down."
    >
      <template v-slot:cell(status)="data">
        <b-button v-if="data.value === 'Closed'" variant="primary" size="sm">
          {{ data.value }}
        </b-button>
        <b-button v-else variant="outline-primary" size="sm">
          {{ data.value }}
        </b-button>
      </template>
      <template v-slot:cell(quantity)="data">
        {{ data.item.done }}/{{ data.item.quantity }}
      </template>
      <template v-slot:cell(rating)="rate">
        <div
          @click.stop="viewHistory(rate)"
          v-if="rate.value && !isNaN(+rate.value) && rate.item.done > 0"
        >
          <star-rating
            :rating="+rate.value"
            read-only
            :show-rating="true"
            :star-size="25"
            :increment="0.5"
          />
        </div>

        <b-button variant="primary" size="sm" v-else @click="reviewProject(rate)">Review</b-button>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />

    <b-modal
      v-model="showModalHistory"
      v-if="projectChosen"
      centered
      :title="projectChosen.name"
      hide-footer
      size="lg"
    >
      <p class="mb-2">{{ projectChosen.project_type }}</p>
      <p class="mb-4">Location &nbsp;&nbsp;&nbsp;&nbsp;{{ projectChosen.location }}</p>
      <b-table
        show-empty
        empty-text=""
        striped
        hover
        :items="histories"
        :fields="historyField"
        responsive
      >
        <template v-slot:cell(rating)="rate">
          <div v-if="rate.value">
            <div
              v-for="(r, idx) in rate.item.aspect.map(c => c.rating)"
              :key="idx"
              style="margin-bottom: 30px"
            >
              <star-rating
                :rating="+r"
                read-only
                :show-rating="true"
                :star-size="25"
                :increment="0.5"
              />
            </div>
          </div>
          <b-button
            variant="primary"
            size="sm"
            v-else
            @click="
              $store.dispatch(
                'goToPage',
                `/project-customer/${rate.item.project_id}/feedback?list_id=${rate.item.list_feedback_project_id}`
              )
            "
            >Review</b-button
          >
        </template>
        <template v-slot:cell(aspect)="data">
          <div v-for="(s, idx) in data.value" :key="s.id">
            Service : {{ s.service }}<br />
            {{
              s.rating ? (+s.rating >= 4 ? "Satisfied aspects : " : "Aspects to improve : ") : ""
            }}
            {{ s.aspect }}
            <hr class="mb-2 mt-2" v-if="idx !== data.value.length - 1" />
          </div>
        </template>
      </b-table>
    </b-modal>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import { perPageOptions, statusProjects, departments } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  name: "ProjectCustomer",
  mounted() {
    axios
      .get(`/project/read/${this.getCompanyId()}`)
      .then(res => {
        this.projects = res.data.data;
        let locations = [];
        res.data.data.map(p => {
          if (!locations.find(l => l.value === p.location) && p.location) {
            locations.push({ value: p.location, text: p.location });
          }
        });
        this.locationOptions = this.locationOptions.concat(locations);
      })
      .catch(() => {});

    departments().then(res => {
      this.typeOptions = [
        {
          value: null,
          text: "All Project Type"
        },
        ...res
      ];
    });
  },
  data() {
    return {
      statusOptions: statusProjects,
      typeOptions: [
        {
          value: null,
          text: "All Project Types"
        }
      ],
      locationOptions: [
        {
          value: null,
          text: "All Locations"
        }
      ],
      selectVal: {
        location: null,
        project_type: null,
        status: null
      },
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      projectFields: [
        { key: "name", label: "Project Name", sortable: true },
        { key: "start", label: "Est Start Date", sortable: true },
        { key: "finish", label: "Est Finish Date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "rating", label: "Average Rating", sortable: true }
      ],
      historyField: ["date", "rating", { key: "aspect", label: "Aspects" }],
      histories: [{ date: "a", rating: "1" }],
      projects: [],
      showModalHistory: false,
      projectChosen: null
    };
  },
  components: {
    StarRating
  },
  computed: {
    rows() {
      return this.projects.length;
    },
    filteredItems() {
      return this.projects.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep = keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.projects[0]);
    }
  },
  methods: {
    showProjectDetail(row) {
      this.$store.dispatch("goToPage", `/project-customer/${row.project_id}`);
    },
    viewHistory(rate) {
      if (rate.item.quantity <= 1) return;
      else
        axios
          .get(`/feedbackproject/list/${rate.item.project_id}`)
          .then(res => {
            this.histories = res.data.data;
            this.projectChosen = rate.item;
            this.showModalHistory = true;
          })
          .catch(() => {});
    },
    reviewProject(item) {
      if (item.item.quantity > 1) {
        this.viewHistory(item);
      } else {
        this.$store.dispatch("goToPage", `/project-customer/${item.item.project_id}/feedback`);
      }
    }
  }
};
</script>

<style scoped>
@media (min-width: 701px) {
  .per-page-text {
    margin-top: 5px;
  }
}
</style>
