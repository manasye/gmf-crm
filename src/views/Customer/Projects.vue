<template>
  <b-container fluid class="container-app">
    <Header title="PROJECT LIST" data-intro="PRoject"></Header>

    <b-row>
      <b-col cols="6" md="2" class="mb-3 mb-md-0">
        <b-form-select v-model="selectVal.location" :options="locationOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.project_type" :options="typeOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.status" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="3">
        <b-row>
          <b-col cols="0" md="8" class="d-none d-md-block">
            <p class="per-page-text">Number of items per page</p>
          </b-col>
          <b-col cols="12" md="4">
            <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
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
    >
      <template v-slot:cell(status)="data">
        <b-badge v-if="data.value === 'Closed'" variant="danger">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
        <b-badge v-if="data.value === 'Active'" variant="success">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
        <b-badge v-else variant="secondary">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
      </template>
      <template v-slot:cell(rating)="rate">
        <star-rating
          :rating="+rate.value"
          read-only
          :show-rating="false"
          :star-size="25"
          :increment="0.5"
          v-if="rate.value && !isNaN(+rate.value)"
        ></star-rating>

        <b-button
          variant="primary"
          size="sm"
          v-else
          @click="$store.dispatch('goToPage', `/project-customer/${rate.item.project_id}/feedback`)"
          >Review</b-button
        >
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
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
      })
      .catch(() => {});
  },
  data() {
    return {
      statusOptions: statusProjects,
      typeOptions: [
        {
          value: null,
          text: "All Project Types"
        },
        ...departments
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
        { key: "project_id", sortable: true },
        { key: "name", sortable: true },
        { key: "start", label: "Est Start Date", sortable: true },
        { key: "finish", label: "Est Finish Date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", label: "Status" },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "rating", label: "Rating", sortable: true }
      ],
      projects: []
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
