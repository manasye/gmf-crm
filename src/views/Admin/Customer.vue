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
      <b-col cols="2" class="mt-3 text-right"
        ><b-button variant="success">Customer Form</b-button></b-col
      >
      <b-col cols="2" class="mt-3 text-right"
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
          icon="pen"
          style="cursor: pointer"
          @click="editStatus(data.item)"
        ></font-awesome-icon>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar";

const dummyCustomer = {
  customer_id: "DGIA10291",
  company_name: "Korean Airline",
  region: "Domestic",
  country: "Indonesia",
  role: "Passenger",
  business_model: "Operator",
  status: "active"
};

export default {
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
      statusOptions: [],
      status: null,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      customers: Array(10).fill(dummyCustomer),
      customersFields: [
        { key: "customer_id", sortable: true },
        { key: "company_name", sortable: true },
        { key: "region", sortable: true },
        { key: "country", sortable: true },
        { key: "role", sortable: true },
        { key: "business_model", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ]
    };
  },
  methods: {
    showCustomer(row) {
      this.$store.dispatch("goToPage", `/customer/${row.company_name}/Overview`);
    },
    getBadgesVariant(val) {
      if (val === "inactive") return "warning";
      else if (val === "active") return "success";
      else return "secondary";
    },
    editStatus(rowData) {
      console.log(rowData);
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
