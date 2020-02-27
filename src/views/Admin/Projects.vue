<template>
  <b-container fluid class="container-app">
    <Header title="Project List" />

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectVal.company_name" :options="companyOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.project_type" :options="projectDropdown" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.status" :options="statusOptions" />
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

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />

    <b-modal
      v-model="showModalHistory"
      v-if="projectChosen"
      centered
      :title="projectChosen.name"
      hide-footer
    >
      <p class="mb-2">{{ projectChosen.project_type }}</p>
      <p class="mb-4">Location &nbsp;&nbsp;&nbsp;&nbsp;{{ projectChosen.location }}</p>
      <b-table show-empty striped hover :items="histories" :fields="historyField">
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

    if (!this.isAdmin()) {
      this.projectFields.pop();
    }
  },
  data() {
    return {
      selectVal: {
        status: null,
        project_type: null,
        company_name: null
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
        { key: "company_id", label: "Company Id", sortable: true },
        { key: "name", label: "Project Name", sortable: true },
        { key: "start", label: "Est Start Date", sortable: true },
        { key: "finish", label: "Est Finish Date", sortable: true },
        { key: "project_type", sortable: true },
        { key: "status", sortable: true },
        { key: "quantity", label: "Qty", sortable: true },
        { key: "rating", sortable: true },
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
      historyField: ["date", "rating"]
    };
  },
  components: { StarRating, Datepicker },
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
    getData() {
      axios
        .get("/project/read")
        .then(res => {
          this.projects = res.data.data.map(el => {
            let o = Object.assign({}, el);
            if (this.isAdmin()) o.edit = "a";
            return o;
          });
          let companies = [];
          res.data.data.map(p => {
            if (!companies.find(l => l.value === p.company_name) && p.company_name) {
              companies.push({ value: p.company_name, text: p.company_name });
            }
          });
          this.companyOptions = this.companyOptions.concat(companies);
        })
        .catch(() => {});
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
      console.log(rate);
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
