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

export default {
  data() {
    return {
      selectedStatus: null,
      selectedSender: null,
      selectedCompany: null,
      selectedDept: null,
      statusOptions: [],
      senderOptions: [],
      companyOptions: [],
      deptOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      complaintFields: [
        { key: "complaint_id", sortable: true },
        { key: "date", sortable: true },
        { key: "company", sortable: true },
        { key: "sender", sortable: true },
        { key: "service", sortable: true },
        { key: "subject", sortable: true },
        { key: "status", sortable: true }
      ],
      complaints: [
        {
          complaint_id: "CND",
          date: "23/7/19",
          company: "a",
          sender: "a",
          service: "a",
          subject: "aa",
          status: "Receive"
        }
      ]
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