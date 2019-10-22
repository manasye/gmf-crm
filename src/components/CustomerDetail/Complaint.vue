<template>
  <div>
    <h5>Complaint List</h5>
    <b-row class="mt-4">
      <b-col cols="6" md="2">
        <b-form-select v-model="sender" :options="sendersOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="dept" :options="deptOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0 mb-3 mb-md-0">
        <b-form-select v-model="status" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="0" md="3"></b-col>
      <b-col cols="8" md="2" class="mt-2">Numbers of item per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
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
  </div>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";

export default {
  data() {
    return {
      sendersOptions: [],
      deptOptions: [],
      statusOptions: [],
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      sender: null,
      dept: null,
      status: null,
      complaintFields: [
        { key: "complaint_id", sortable: true },
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "department", sortable: true },
        { key: "subject / Complaint", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      complaints: [
        {
          complaint_id: "CND",
          date: "23/7/19",
          sender: "a",
          department: "a",
          "subject / Complaint": "aa",
          status: "Open"
        }
      ]
    };
  },
  methods: {
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
    },
    showComplaint() {}
  },
  computed: {
    rows() {
      return this.complaints.length;
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
