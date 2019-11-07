<template>
  <b-container fluid class="container-app">
    <Header title="Customer List"></Header>
    <b-row>
      <b-col cols="2"
        ><b-form-select v-model="region" :options="regionOptions"></b-form-select
      ></b-col>
      <b-col cols="2"
        ><b-form-select v-model="country" :options="countryOptions"></b-form-select
      ></b-col>
      <b-col cols="2"><b-form-select v-model="role" :options="roleOptions"></b-form-select></b-col>
      <b-col cols="2"><b-form-select v-model="bm" :options="bmOptions"></b-form-select></b-col>
      <b-col cols="2"
        ><b-form-select v-model="status" :options="statusOptions"></b-form-select
      ></b-col>
      <b-col cols="1" class="mt-2 text-right">Per page</b-col>
      <b-col cols="1"
        ><b-form-select v-model="perPage" :options="perPageOptions"></b-form-select
      ></b-col>
      <b-col cols="8"></b-col>
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success">Customer Form</b-button></b-col
      >
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success">Add New Customer</b-button></b-col
      >
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="customers"
      :fields="customersFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showCustomer"
    >
      <template v-slot:cell(status)="data">
        <b-badge :variant="getBadgesVariant(data.value)" style="margin-right: 30px">
          <p class="status-badges" :class="getBadgesVariant(data.value)">{{ data.value }}</p>
        </b-badge>
        <font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="pen"
          style="cursor: pointer"
          @click.stop="editStatus(data.item)"
        ></font-awesome-icon>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>

    <b-modal
      v-model="showModalStatus"
      centered
      @ok="changeStatus"
      title="Edit Company"
      v-if="showModalStatus"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Region</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.region"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Country</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.country"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Role</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.role"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Business Model</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.business_model"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.status" :options="statusOptions"></b-form-select
        ></b-col>
        <b-col cols="4"> <label class="mt-2">Est Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.est_date"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_type"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Shareholder</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.shareholder"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Alliance</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.alliance"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">MRO</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.MRO"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Fleet Size</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.fleet_size"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Destination</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.destination"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Since</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_since"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar";
import axios from "axios";
import swal from "sweetalert";

const dummyCustomer = {
  customer_id: "DGIA10291",
  name: "Korean Airline",
  region: "Domestic",
  country: "Indonesia",
  role: "Passenger",
  business_model: "Operator",
  status: "active"
};

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      this.getCompanyData();
    }
  },
  data() {
    return {
      regionOptions: [],
      region: null,
      countryOptions: [],
      country: null,
      roleOptions: [],
      role: null,
      bmOptions: [],
      bm: null,
      statusOptions: [
        {
          value: null,
          text: "Select status"
        },
        {
          value: "Active",
          text: "Active"
        },
        {
          value: "Inactive",
          text: "Inactive"
        },
        {
          value: "Obsolete",
          text: "Obsolete"
        }
      ],
      status: null,
      editedData: null,
      editedId: null,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      customers: Array(10).fill(dummyCustomer),
      customersFields: [
        // { key: "customer_id", sortable: true },
        { key: "name", label: "Company Name", sortable: true },
        { key: "region", sortable: true },
        { key: "country", sortable: true },
        { key: "role", sortable: true },
        { key: "business_model", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      showModalStatus: false
    };
  },
  methods: {
    showCustomer(row) {
      this.$store.dispatch("goToPage", `/customer/${row.company_id}/Overview`);
    },
    getBadgesVariant(val) {
      if (val === "Inactive") return "warning";
      else if (val === "Active") return "success";
      else return "secondary";
    },
    editStatus(rowData) {
      this.showModalStatus = true;
      this.editedId = rowData.company_id;
      this.editedData = rowData;
    },
    changeStatus() {
      axios
        .post("/company/update", { id: this.editedData.company_id, ...this.editedData })
        .then(() => {
          this.getCompanyData();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getCompanyData() {
      axios
        .get("/company/read")
        .then(res => {
          this.customers = res.data.data;
        })
        .catch(() => {});
    }
  },
  computed: {
    rows() {
      return this.customers.length;
    }
  }
};
</script>

<style lang="scss" scoped>
.status-badges {
  margin: 5px;
  text-transform: capitalize;
  color: white;
}
</style>
