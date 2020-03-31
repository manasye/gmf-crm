<template>
  <b-container fluid class="container-app">
    <Header title="Project List" subtitle="List of Garuda Maintenance Facility Client Project" />

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectVal.company_id" :options="companyOptions" @input="getData" />
      </b-col>
      <b-col cols="2">
        <b-form-select
          v-model="selectVal.project_type"
          :options="projectDropdown"
          @input="getData"
        />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.status" :options="statusOptions" @input="getData" />
      </b-col>
      <b-col cols="2">
        <b-button variant="success" @click="addProject">Add New Project</b-button>
      </b-col>
      <b-col cols="4" style="text-align: right">
        <b-row>
          <b-col cols="9" class="d-none d-md-block">
            <p class="mt-2">Number of items per page</p>
          </b-col>
          <b-col cols="3">
            <b-form-select v-model="perPage" :options="perPageOptions" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <loader v-if="isLoading"></loader>
    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="projects"
      :fields="projectFields"
      :per-page="perPage"
      responsive
      @row-clicked="showProjectDetail"
      show-empty
      @sort-changed="sortingChanged"
      :no-local-sorting="true"
      :style="{ opacity: isLoading ? '0' : '1' }"
    >
      <template v-slot:cell(status)="data">
        <b-button v-if="data.value === 'Closed'" variant="primary" size="sm">
          {{ data.value }}
        </b-button>
        <b-button v-else variant="outline-primary" size="sm">
          {{ data.value }}
        </b-button>
      </template>
      <template v-slot:cell(rating)="rate">
        <div @click.stop="viewHistory(rate)">
          <star-rating
            :rating="+rate.value"
            read-only
            :show-rating="true"
            :star-size="25"
            :increment="0.5"
            v-if="!isNaN(+rate.value) && rate.item.done > 0"
          />
        </div>
      </template>
      <template v-slot:cell(edit)="data">
        <font-awesome-icon
          v-if="isAdmin()"
          style="cursor: pointer;"
          icon="pen"
          @click.stop="editProject(data.item)"/>
        <font-awesome-icon
          v-if="isAdmin()"
          icon="trash"
          style="cursor: pointer"
          class="ml-3"
          @click.stop="removeProject(data.item)"
      /></template>
      <template v-slot:cell(quantity)="data">
        {{ data.item.done }}/{{ data.item.quantity }}
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="maxPage"
      :per-page="perPage"
      align="right"
      @input="changePage"
    />

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
      <b-table show-empty striped hover :items="histories" :fields="historyField" responsive>
        <template v-slot:cell(rating)="rate">
          <star-rating
            :rating="+rate.value"
            read-only
            :show-rating="true"
            :star-size="25"
            :increment="0.5"
            v-if="rate.value"
          />
          <p class="mb-0" v-else>Not yet rated</p>
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

    <b-modal v-model="showModal" centered title="Manage Project" @ok="postProject">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Project Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Start Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <datepicker v-model="editedData.start" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Finish Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <datepicker v-model="editedData.finish" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Project Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.project_type" :options="projectOptions" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Quantity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.quantity" type="number" />
        </b-col>
        <b-col cols="4" v-if="!newMode"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3" v-if="!newMode">
          <b-form-select v-model="editedData.status" :options="statusOptions"> </b-form-select>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Company Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.company_name" :options="allCompanies" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Location</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.location" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">AC Reg</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.ac_reg" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.type" />
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import { perPageOptions, departments, statusProjects } from "@/utility/globalVar.js";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import Datepicker from "vuejs-datepicker";
import Loader from "@/components/Loader.vue";

export default {
  mounted() {
    this.getData();
    departments().then(res => {
      this.projectOptions = res;
      this.projectDropdown = [
        {
          value: null,
          text: "All Project Types"
        },
        ...res
      ];
    });
    if (!this.isAdmin()) {
      this.projectFields.pop();
    }
    this.getCompanyFilter();
    axios
      .get("/company/read")
      .then(res => {
        let companies = [];
        const data = res.data.data;
        data.map(c => {
          companies.push({ value: c.name, text: c.name });
        });
        this.allCompanies = companies;
      })
      .catch(() => {});
  },
  data() {
    return {
      selectVal: {
        status: null,
        project_type: null,
        company_id: null
      },
      statusOptions: statusProjects,
      projectOptions: [],
      companyOptions: [
        {
          value: null,
          text: "All Companies"
        }
      ],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      projectFields: [
        { key: "company_name", label: "Company", sortable: true },
        { key: "name", label: "Project Name", sortable: true },
        { key: "start", label: "Start Date", sortable: true },
        { key: "finish", label: "Finish Date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", sortable: true },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "rating", label: "Average Rating", sortable: true },
        { key: "edit", label: "Edit" }
      ],
      projects: [],
      showModal: false,
      editedData: {},
      newMode: true,
      showModalHistory: false,
      projectChosen: null,
      projectDropdown: [],
      histories: [],
      allCompanies: [],
      historyField: ["date", "rating", { key: "aspect", label: "Aspects" }],
      sortBy: null,
      sortDirection: null,
      maxPage: 1,
      isLoading: false
    };
  },
  components: { StarRating, Datepicker, Loader },
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
    sortingChanged(ctx) {
      this.sortBy = ctx.sortBy;
      this.sortDirection = ctx.sortDesc;
      this.getData();
    },
    changePage() {
      this.getData();
    },
    getData() {
      this.isLoading = true;
      const params = {
        page: +this.currentPage,
        per_page: +this.perPage,
        sort: {
          by: this.sortBy,
          sort: this.sortDirection ? "desc" : "asc"
        },
        filters: this.selectVal
      };
      axios
        .get("/project/read", { params })
        .then(res => {
          this.projects = res.data.data.map(el => {
            let o = Object.assign({}, el);
            if (this.isAdmin()) o.edit = "a";
            return o;
          });
          this.maxPage = Math.ceil(res.data.total / +this.perPage);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getCompanyFilter() {
      axios
        .get("/company/projectoption")
        .then(res => {
          this.companyOptions = this.companyOptions.concat(
            res.data.data.map(c => {
              return { value: c.company_id, text: c.name };
            })
          );
        })
        .catch(() => {});
    },
    showProjectDetail(row) {
      this.$store.dispatch("goToPage", `/project-customer/${row.project_id}`);
    },
    addProject() {
      this.showModal = true;
      this.newMode = true;
    },
    editProject(data) {
      this.newMode = false;
      this.editedData = data;
      this.showModal = true;
    },
    postProject() {
      const url = this.newMode ? "/project/create" : "/project/update";
      const data = this.editedData;
      axios
        .post(url, {
          ...data,
          start: moment(this.editedData.start).format("YYYY-MM-DD"),
          finish: moment(this.editedData.finish).format("YYYY-MM-DD"),
          rating: +this.editedData.rating
        })
        .then(() => {
          this.getData();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    removeProject(project) {
      axios
        .get(`/project/delete/${project.project_id}`)
        .then(() => {
          swal("Success", `Project successfully deleted`, "success");
          this.getData();
        })
        .catch(() => {});
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
    moment: function() {
      return moment();
    }
  }
};
</script>

<style scoped />
