<template>
  <b-container fluid class="container-app">
    <Header title="Project List"></Header>

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
      <b-col cols="2">
        <b-button variant="success" @click="showModal = true">Add New Project</b-button>
      </b-col>
      <b-col cols="4" style="text-align: right">
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
      show-empty
    >
      <template v-slot:cell(status)="data">
        <b-badge v-if="data.value === 'Closed'" variant="primary">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
        <b-badge v-if="data.value === 'On Going'" variant="secondary">
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
          v-if="!isNaN(+rate.value)"
        ></star-rating>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    ></b-pagination>

    <b-modal v-model="showModal" centered title="Manage Project" @ok="postProject">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Start Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.start" placeholder="YYYY-MM-DD"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Finish Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.finish" placeholder="YYYY-MM-DD"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Project Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.project_type" :options="departments"></b-form-select>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Quantity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.quantity" type="number"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Company Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.company_name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Location</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.location"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">AC Reg</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.ac_reg"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.type"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import { perPageOptions, departments } from "@/utility/globalVar.js";
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    this.getData();
  },
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
      departments,
      perPage: "10",
      projectFields: [
        { key: "company_name", label: "Company", sortable: true },
        { key: "name", label: "Project", sortable: true },
        { key: "start", label: "Est Start Date", sortable: true },
        { key: "finish", label: "Est Finish Date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", sortable: true },
        { key: "quantity", sortable: true },
        { key: "rating", sortable: true }
      ],
      projects: [],
      showModal: false,
      editedData: {}
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
      this.$store.dispatch("goToPage", `/project-customer/${row.project_id}`);
    },
    postProject() {
      axios
        .post("/project/create", this.editedData)
        .then(res => {
          this.getData();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getData() {
      axios
        .get("/project/read")
        .then(res => {
          this.projects = res.data.data;
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped></style>
