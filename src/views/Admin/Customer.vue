<template>
  <b-container fluid class="container-app">
    <Header title="Customer List"></Header>
    <b-row>
      <!--      <b-col cols="2"-->
      <!--        ><b-form-select v-model="selectVal.region" :options="regionOptions"></b-form-select-->
      <!--      ></b-col>-->
      <b-col cols="2"
        ><b-form-select v-model="selectVal.country" :options="countryOptions"></b-form-select
      ></b-col>
      <b-col cols="2"
        ><b-form-select v-model="selectVal.company_role" :options="roleOptions"></b-form-select
      ></b-col>
      <b-col cols="2"
        ><b-form-select v-model="selectVal.business_model" :options="bmOptions"></b-form-select
      ></b-col>
      <b-col cols="2"
        ><b-form-select v-model="selectVal.status" :options="statusOptions"></b-form-select
      ></b-col>
      <b-col cols="2"></b-col>
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
      :items="filteredItems"
      :fields="customersFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showCustomer"
      show-empty
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
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.image"
            placeholder="Choose new image"
          ></b-form-file>
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
          <b-form-input v-model="editedData.company_role"></b-form-input>
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
          <b-form-input v-model="editedData.est_date" type="number"></b-form-input>
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
          <b-form-input v-model="editedData.fleet_size" type="number"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Destination</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.destination" type="number"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Since</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_since" type="number"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { perPageOptions, religions } from "@/utility/globalVar";
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
      regionOptions: religions,
      countryOptions: [
        {
          value: null,
          text: "All Countries"
        }
      ],
      roleOptions: [
        {
          value: null,
          text: "All Roles"
        }
      ],
      bmOptions: [
        {
          value: null,
          text: "All Business Models"
        }
      ],
      statusOptions: [
        {
          value: null,
          text: "All status"
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
      selectVal: {
        region: null,
        country: null,
        company_role: null,
        business_model: null,
        status: null
      },
      editedData: {
        image: "",
        name: "",
        region: "",
        country: "",
        company_role: "",
        business_model: "",
        status: "",
        est_date: 0,
        type: "",
        customer_type: "",
        shareholder: "",
        alliance: "",
        MRO: "",
        fleet_size: 0,
        destination: 0,
        customer_since: 0,
        company_id: 0
      },
      editedId: null,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      customers: [],
      customersFields: [
        // { key: "customer_id", sortable: true },
        { key: "name", label: "Company Name", sortable: true },
        { key: "region", sortable: true },
        { key: "country", sortable: true },
        { key: "company_role", sortable: true },
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
      let formData = new FormData();
      formData.set("MRO", this.editedData.MRO || "");
      formData.set("alliance", this.editedData.alliance || "");
      formData.set("business_model", this.editedData.business_model || "");
      formData.set("company_id", this.editedData.company_id || "");
      formData.set("company_role", this.editedData.company_role || "");
      formData.set("country", this.editedData.country || "");
      formData.set("customer_since", this.editedData.customer_since || "");
      formData.set("customer_type", this.editedData.customer_type || "");
      formData.set("destination", this.editedData.destination || "");
      formData.set("est_date", this.editedData.est_date || "");
      formData.set("fleet_size", this.editedData.fleet_size || "");
      formData.set("id", this.editedData.company_id || "");
      formData.set("image", this.editedData.image || "");
      formData.set("name", this.editedData.name || "");
      formData.set("region", this.editedData.region || "");
      formData.set("shareholder", this.editedData.shareholder || "");
      formData.set("status", this.editedData.status || "");
      formData.set("type", this.editedData.type || "");

      axios
        .post("/company/update", formData)
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
          let countries = [],
            roles = [],
            businessModels = [];
          res.data.data.map(p => {
            if (!countries.find(l => l.value === p.country) && p.country) {
              countries.push({ value: p.country, text: p.country });
            }
            if (!roles.find(l => l.value === p.company_role) && p.company_role) {
              roles.push({ value: p.company_role, text: p.company_role });
            }
            if (!businessModels.find(l => l.value === p.business_model) && p.business_model) {
              businessModels.push({ value: p.business_model, text: p.business_model });
            }
          });
          this.countryOptions = this.countryOptions.concat(countries);
          this.roleOptions = this.roleOptions.concat(roles);
          this.bmOptions = this.bmOptions.concat(businessModels);
        })
        .catch(() => {});
    }
  },
  computed: {
    rows() {
      return this.customers.length;
    },
    filteredItems() {
      return this.customers.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep = keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.customers[0]);
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
