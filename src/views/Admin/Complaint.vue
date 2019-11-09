<template>
  <b-container fluid class="container-app">
    <Header title="Complaint List"></Header>

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectedCompany" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedSender" :options="senderOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedDept" :options="deptOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedStatus" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="4" style="text-align: right">
        <b-row>
          <b-col cols="9" class="d-none d-md-block">
            <p class="mt-2">Number of items per page</p>
          </b-col>
          <b-col cols="3">
            <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="complaints"
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

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    ></b-pagination>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/complaint/read")
      .then(res => {
        this.complaints = res.data.data;
      })
      .catch(() => {});
  },
  data() {
    return {
      selectedStatus: null,
      selectedSender: null,
      selectedCompany: null,
      selectedDept: null,
      statusOptions: [
        {
          value: null,
          text: "Select status"
        },
        {
          value: "Open",
          text: "Open"
        },
        {
          value: "Receive",
          text: "Receive"
        },
        {
          value: "On Progress",
          text: "On Progress"
        },
        {
          value: "Closed",
          text: "Closed"
        }
      ],
      senderOptions: [],
      companyOptions: [],
      deptOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      complaintFields: [
        { key: "complaint_id", sortable: true },
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
    }
  }
};
</script>

<style scoped></style>
