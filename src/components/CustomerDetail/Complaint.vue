<template>
  <div>
    <h5>Complaint List</h5>
    <b-row class="mt-4">
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.sender" :options="sendersOptions" />
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.service" :options="deptOptions" />
      </b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0 mb-3 mb-md-0">
        <b-form-select v-model="selectVal.status" :options="statusOptions" />
      </b-col>
      <b-col cols="0" md="3" />
      <b-col cols="8" md="2" class="mt-2 text-md-right">Per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="complaintFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showComplaint"
      show-empty
      empty-text=""
    >
      <template v-slot:cell(status)="data">
        <b-badge :variant="getVariantBadge(data.value)">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />
  </div>
</template>

<script>
import { perPageOptions, departments, statusComplaints } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      axios
        .get(`/complaint/read/${this.$route.params.id}`)
        .then(({ data }) => {
          this.complaints = data.data;
          let senders = [];
          data.data.map(p => {
            if (!senders.find(l => l.value === p.sender) && p.sender) {
              senders.push({ value: p.sender, text: p.sender });
            }
          });
          this.sendersOptions = this.sendersOptions.concat(senders);
        })
        .catch(() => {});
    }

    departments().then(res => {
      this.deptOptions = [
        {
          value: null,
          text: "All Departments"
        },
        ...res
      ];
    });
  },
  data() {
    return {
      sendersOptions: [
        {
          value: null,
          text: "All Senders"
        }
      ],
      deptOptions: [
        {
          value: null,
          text: "All Departments"
        }
      ],
      statusOptions: statusComplaints,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      selectVal: {
        sender: null,
        service: null,
        status: null
      },
      complaintFields: [
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "service", sortable: true },
        { key: "subject", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      complaints: []
    };
  },
  methods: {
    getVariantBadge(status) {
      switch (status) {
        case "Closed":
          return "success";
        case "Open":
          return "danger";
        case "Received":
          return "warning";
        default:
          return "primary";
      }
    },
    showComplaint(row) {
      this.$store.dispatch("goToPage", `/complaint/${row.complaint_id}`);
    }
  },
  computed: {
    rows() {
      return this.complaints.length;
    },
    filteredItems() {
      return this.complaints.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep = keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.complaints[0]);
    }
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
