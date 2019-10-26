<template>
  <b-container fluid class="container-app">
    <Header title="PROJECT LIST"></Header>

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectedCompany" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedProject" :options="projectOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedStatus" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="6" style="text-align: right">
        <b-row>
          <b-col cols="10" class="d-none d-md-block">
            <p class="mt-2">Number of items per page</p>
          </b-col>
          <b-col cols="2">
            <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="projects"
      :fields="projectFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showProjectDetail"
    >
      <template v-slot:cell(status)="data">
        <b-badge v-if="data.value === 'Closed'" variant="primary">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
        <b-badge v-if="data.value === 'Ongoing'" variant="secondary">
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
          v-if="rate.value"
        ></star-rating>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    ></b-pagination>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import { perPageOptions } from "@/utility/globalVar.js";

export default {
  data() {
    return {
      selectedStatus: null,
      selectedProject: null,
      selectedCompany: null,
      statusOptions: [],
      projectOptions: [],
      companyOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      projectFields: [
        { key: "company", sortable: true },
        { key: "project", sortable: true },
        { key: "est_start_date", sortable: true },
        { key: "est_finish_date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", sortable: true },
        { key: "qty", sortable: true },
        { key: "rating", sortable: true }
      ],
      projects: [
        {
          company: "a",
          project: "b",
          est_start_date: "a",
          est_finish_date: "a",
          project_type: "Base Maintenance",
          status: "Ongoing",
          qty: "a",
          rating: "2"
        }
      ]
    };
  },
  components: { StarRating },
  computed: {
    rows() {
      return this.projects.length;
    }
  },
  methods: {
    showProjectDetail(row) {
      this.$store.dispatch("goToPage", `/project-customer/${row.project}`);
    }
  }
};
</script>

<style scoped></style>
