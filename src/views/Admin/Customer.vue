<template>
  <b-container fluid class="container-app">
    <Header title="Customer List" subtitle="" />
    <b-row>
      <b-col cols="2"> <b-form-select v-model="selectVal.region" :options="regionOptions"/></b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.country" :options="countryOptions"
      /></b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.company_role" :options="roleOptions"
      /></b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.business_model" :options="bmOptions"
      /></b-col>
      <b-col cols="2"> <b-form-select v-model="selectVal.status" :options="statusOptions"/></b-col>
      <b-col cols="1" class="mt-2 text-right">Per page</b-col>
      <b-col cols="1"> <b-form-select v-model="perPage" :options="perPageOptions"/></b-col>
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success" style="width: 100%" @click="showModalCust = true"
          >Add Customer Type</b-button
        ></b-col
      ><b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success" style="width: 100%" @click="showModalAlliance = true"
          >Add Alliance</b-button
        ></b-col
      ><b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success" style="width: 100%" @click="downloadForm"
          >Customer Form</b-button
        ></b-col
      >
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success" @click="showModalAdd = true" style="width: 100%"
          >Upload Form</b-button
        ></b-col
      >
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button
          variant="success"
          @click="
            () => {
              editedData = {};
              showModalStatus = true;
            }
          "
          style="width: 100%"
          >Add New Company</b-button
        ></b-col
      >
      <b-col cols="2" class="mt-3 text-right" v-if="isAdmin()"
        ><b-button variant="success" @click="showModalAdmin = true" style="width: 100%"
          >Add Admin / Guest</b-button
        ></b-col
      >
    </b-row>
    <loader v-if="isLoading"></loader>
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
      :style="{ opacity: isLoading ? '0' : '1' }"
    >
      <template v-slot:cell(status)="data">
        <b-badge :variant="getBadgesVariant(data.value)" style="margin-right: 30px">
          <p class="status-badges" :class="getBadgesVariant(data.value)">{{ data.value }}</p>
        </b-badge>
        <font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="pen"
          style="cursor: pointer"
          class="mr-3"
          @click.stop="editStatus(data.item)"
        />
        <font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="trash"
          style="cursor: pointer"
          @click.stop="removeCustomer(data.item)"
        />
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />

    <b-modal
      v-model="showModalCust"
      centered
      title="Add Customer Type"
      v-if="showModalCust"
      @ok="addCustomerType"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Customer Type</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="customerType" /> </b-col
        ><b-col cols="12">
          <p class="mb-0 p-link" @click="showModalListCust = true">Remove Customer Type</p>
        </b-col></b-row
      >
    </b-modal>

    <b-modal
      v-model="showModalAlliance"
      centered
      title="Add Alliance"
      v-if="showModalAlliance"
      @ok="addAlliance"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Alliance</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="alliance" /> </b-col
        ><b-col cols="12">
          <p class="mb-0 p-link" @click="showModalListAlliance = true">Remove Alliance</p>
        </b-col></b-row
      >
    </b-modal>

    <b-modal
      v-model="showModalListAlliance"
      centered
      title="Remove Alliance"
      v-if="showModalListAlliance"
    >
      <b-table
        striped
        hover
        :items="
          allianceOptions.map(e => {
            return { id: e.id, name: e.value };
          })
        "
        :fields="allianceFields"
        responsive
        show-empty
        ><template v-slot:cell(delete)="data">
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="trash"
            style="cursor: pointer"
            @click.stop="removeAlliance(data.item)"
        /></template>
      </b-table>
    </b-modal>

    <b-modal
      v-model="showModalListCust"
      centered
      title="Remove Customer Type"
      v-if="showModalListCust"
    >
      <b-table
        striped
        hover
        :items="
          custTypeOptions.map(e => {
            return { id: e.id, name: e.value };
          })
        "
        :fields="allianceFields"
        responsive
        show-empty
        ><template v-slot:cell(delete)="data">
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="trash"
            style="cursor: pointer"
            @click.stop="removeCustType(data.item)"
        /></template>
      </b-table>
    </b-modal>

    <b-modal
      v-model="showModalAdd"
      centered
      title="Add Customer"
      v-if="showModalAdd"
      @ok="addCustomer"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Upload File</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-file v-model="customerFile" /> </b-col
      ></b-row>
    </b-modal>

    <b-modal
      v-model="showModalStatus"
      centered
      @ok="changeCustomer"
      title="Manage Company"
      v-if="showModalStatus"
    >
      <b-row
        ><b-col cols="4"> <label class="mt-2">SAP Code</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.company_sap_code" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file accept="image/*" v-model="editedData.image" placeholder="Choose new image" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Region</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.region" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Country</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.country" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Company Role</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.company_role" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Business Model</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.business_model" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.status" :options="statusOptions"
        /></b-col>
        <b-col cols="4"> <label class="mt-2">Establish Year</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.est_date" type="number" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Type</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.customer_type" :options="custTypeOptions" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Shareholder</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.shareholder" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Alliance</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.alliance" :options="allianceOptions" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">MRO</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.MRO" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Fleet Size</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.fleet_size" type="number" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Destination</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.destination" type="number" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Since</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_since" type="number" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Currency</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.currency" type="text" />
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      v-model="showModalAdmin"
      centered
      @ok="postAdmin"
      title="Add Admin"
      v-if="showModalAdmin"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedDataAdmin.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedDataAdmin.image"
            placeholder="Choose new image"
          />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Position</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedDataAdmin.position" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Division</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedDataAdmin.division" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Username</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedDataAdmin.username" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Password</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedDataAdmin.password" /> </b-col>
        <b-col cols="4"> <label class="mt-2">Role</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedDataAdmin.role" :options="rlOptions" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedDataAdmin.status"
            :options="statusOptions"
          /> </b-col></b-row
    ></b-modal>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar";
import axios from "axios";
import swal from "sweetalert";
import Loader from "@/components/Loader.vue";

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
    this.getAllianceOptions();
    this.getCustTypeOptions();
  },
  components: { Loader },
  data() {
    return {
      regionOptions: [
        {
          value: null,
          text: "All Regions"
        }
      ],
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
          text: "All Status"
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
      editedDataAdmin: {
        name: "",
        position: "",
        division: "",
        username: "",
        password: "",
        role: "Admin",
        status: ""
      },
      editedData: {
        image: "",
        name: "",
        region: "",
        country: "",
        company_role: "Customer",
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
        { key: "name", label: "Company Name", sortable: true },
        { key: "company_sap_code", label: "SAP Code", sortable: true },
        { key: "region", sortable: true },
        { key: "country", sortable: true },
        { key: "company_role", sortable: true },
        { key: "business_model", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      showModalStatus: false,
      showModalAdd: false,
      showModalAdmin: false,
      showModalCust: false,
      showModalAlliance: false,
      showModalListCust: false,
      showModalListAlliance: false,
      customerFile: null,
      customerType: null,
      alliance: null,
      rlOptions: [
        {
          value: "Admin",
          text: "Admin"
        },
        {
          value: "Guest",
          text: "Guest"
        },
        {
          value: "Customer",
          text: "Customer"
        }
      ],
      allianceOptions: [],
      custTypeOptions: [],
      allianceFields: ["name", "delete"],
      isLoading: false
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
    changeCustomer() {
      let formData = new FormData();
      if (this.editedData.MRO) formData.set("MRO", this.editedData.MRO || "");
      if (this.editedData.company_sap_code)
        formData.set("company_sap_code", this.editedData.company_sap_code || "");
      if (this.editedData.alliance) formData.set("alliance", this.editedData.alliance || "");
      if (this.editedData.business_model)
        formData.set("business_model", this.editedData.business_model || "");
      if (this.editedData.company_id) formData.set("company_id", this.editedData.company_id || "");
      if (this.editedData.company_role)
        formData.set("company_role", this.editedData.company_role || "");
      if (this.editedData.country) formData.set("country", this.editedData.country || "");
      if (this.editedData.customer_since)
        formData.set("customer_since", this.editedData.customer_since || "");
      if (this.editedData.customer_type)
        formData.set("customer_type", this.editedData.customer_type || "");
      if (this.editedData.destination)
        formData.set("destination", this.editedData.destination || "");
      if (this.editedData.est_date) formData.set("est_date", this.editedData.est_date || "");
      if (this.editedData.fleet_size) formData.set("fleet_size", this.editedData.fleet_size || "");
      if (this.editedData.company_id) formData.set("id", this.editedData.company_id || "");
      if (this.editedData.image instanceof File) formData.set("image", this.editedData.image || "");
      if (this.editedData.name) formData.set("name", this.editedData.name || "");
      if (this.editedData.region) formData.set("region", this.editedData.region || "");
      if (this.editedData.shareholder)
        formData.set("shareholder", this.editedData.shareholder || "");
      if (this.editedData.status) formData.set("status", this.editedData.status || "");
      if (this.editedData.type) formData.set("type", this.editedData.type || "");
      if (this.editedData.currency) formData.set("currency", this.editedData.currency || "");

      let url, msg;
      if (this.editedData.company_id) {
        url = "/company/update";
        msg = "updated";
      } else {
        url = "/company/create";
        msg = "created";
      }

      axios
        .post(url, formData)
        .then(() => {
          swal("Success", `Company successfully ${msg}`, "success");
          this.getCompanyData();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getCompanyData() {
      this.isLoading = true;
      axios
        .get("/company/read")
        .then(res => {
          this.customers = res.data.data;
          let countries = [],
            roles = [],
            businessModels = [],
            regions = [];
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
            if (!regions.find(l => l.value === p.region) && p.region) {
              regions.push({ value: p.region, text: p.region });
            }
          });
          this.countryOptions = this.countryOptions.concat(countries);
          this.roleOptions = this.roleOptions.concat(roles);
          this.bmOptions = this.bmOptions.concat(businessModels);
          this.regionOptions = this.regionOptions.concat(regions);
          this.isLoading = false;
        })
        .catch(() => {});
    },
    addCustomer() {
      let form = new FormData();
      form.set("file", this.customerFile);
      axios
        .post("/company/import", form)
        .then(() => {
          swal("Success", `Company added`, "success");
        })
        .catch(() => {});
    },
    removeCustomer(customer) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this company!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willRemove => {
        if (willRemove)
          axios
            .get(`/company/delete/${customer.company_id}`)
            .then(() => {
              swal("Success", `Company successfully deleted`, "success");
              this.getCompanyData();
            })
            .catch(() => {});
      });
    },
    postAdmin() {
      axios
        .post("/user/create", this.editedDataAdmin)
        .then(() => {
          swal("Success", `Account successfully created`, "success");
        })
        .catch(() => {});
    },
    downloadForm() {
      window.location = axios.defaults.baseURL + "/company/export";
    },
    addCustomerType() {
      axios
        .post("/ctype/create", { name: this.customerType })
        .then(() => {
          this.getCustTypeOptions();
        })
        .catch(() => {});
    },
    addAlliance() {
      axios
        .post("/alliance/create", { name: this.alliance })
        .then(() => {
          this.getAllianceOptions();
        })
        .catch(() => {});
    },
    getAllianceOptions() {
      axios
        .get("/alliance/read")
        .then(res => {
          let alliances = [];
          res.data.data.map(a => {
            alliances.push({ value: a.name, text: a.name, id: a.alliance_id });
          });
          this.allianceOptions = alliances;
        })
        .catch(() => {});
    },
    getCustTypeOptions() {
      axios
        .get("/ctype/read")
        .then(res => {
          let ctypes = [];
          res.data.data.map(c => {
            ctypes.push({ value: c.name, text: c.name, id: c.customer_type_id });
          });
          this.custTypeOptions = ctypes;
        })
        .catch(() => {});
    },
    removeAlliance(item) {
      axios
        .get(`/alliance/delete/${item.id}`)
        .then(() => {
          this.getAllianceOptions();
        })
        .catch(() => {});
    },
    removeCustType(item) {
      axios
        .get(`/ctype/delete/${item.id}`)
        .then(() => {
          this.getCustTypeOptions();
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
