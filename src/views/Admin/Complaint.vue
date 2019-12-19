<template>
  <b-container fluid class="container-app">
    <Header title="Complaint List" />

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectVal.company_name" :options="companyOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.sender" :options="senderOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.service" :options="deptOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.status" :options="statusOptions" />
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
      :fields="complaintFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showComplaint"
      show-empty
    >
      <template v-slot:cell(status)="data">
        <b-badge :variant="getVariantBadge(data.value)">
          <p style="margin: 5px">{{ data.value }}</p>
        </b-badge>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />
  </b-container>
</template>

<script>
import { perPageOptions, departments, statusComplaints } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/complaint/read")
      .then(res => {
        this.complaints = res.data.data;
        let companies = [],
          senders = [];
        res.data.data.map(p => {
          if (!companies.find(l => l.value === p.company_name) && p.company_name) {
            companies.push({ value: p.company_name, text: p.company_name });
          }
          if (!senders.find(l => l.value === p.sender) && p.sender) {
            senders.push({ value: p.sender, text: p.sender });
          }
        });
        this.companyOptions = this.companyOptions.concat(companies);
        this.senderOptions = this.senderOptions.concat(senders);
      })
      .catch(() => {});

    departments().then(res => {
      this.deptOptions = [
        {
          value: null,
          text: "All Services"
        },
        ...res
      ];
    });
  },
  data() {
    return {
      selectVal: {
        status: null,
        sender: null,
        company_name: null,
        service: null
      },
      statusOptions: statusComplaints,
      senderOptions: [
        {
          value: null,
          text: "All Senders"
        }
      ],
      companyOptions: [
        {
          value: null,
          text: "All Companies"
        }
      ],
      deptOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      complaintFields: [
        { key: "complaint_id", label: "Id", sortable: true },
        { key: "date", sortable: true },
        { key: "company_name", label: "Company", sortable: true },
        { key: "sender", sortable: true },
        { key: "service", sortable: true },
        { key: "subject", sortable: true },
        { key: "status", sortable: true }
      ],
      complaints: []
    };
  },
  methods: {
    showComplaint(row) {
      this.$store.dispatch("goToPage", `/complaint/${row.complaint_id}`);
    },
    getVariantBadge(status) {
      switch (status) {
        case "Closed":
          return "success";
        case "Open":
          return "danger";
        case "Receive":
          return "warning";
        default:
          return "primary";
      }
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

<style scoped />
