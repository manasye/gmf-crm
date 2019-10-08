<template>
  <div>
    <Header title="YOUR FEEDBACK LIST"></Header>

    <b-row class="mt-0 mt-md-4">
      <b-col cols="8" md="2" class="mt-2">Numbers of item per page</b-col>
      <b-col cols="4" md="1"
        ><b-form-select v-model="perPage" :options="perPageOptions"></b-form-select
      ></b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0">
        <b-form-select v-model="sender" :options="sendersOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0">
        <b-form-select v-model="dept" :options="deptOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0">
        <b-form-select v-model="status" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="12" md="3" class="text-md-right mt-3 mt-md-0">
        <b-button variant="success" @click="$store.dispatch('goToPage', '/feedback-customer-new')"
          >Add New Feedback</b-button
        >
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="feedbacks"
      :fields="feedbackFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showFeedback"
    >
      <template v-slot:cell(status)="data">
        <b-badge v-if="data.value === 'Closed'" variant="success"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
        <b-badge v-if="data.value === 'Open'" variant="danger"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
        <b-badge v-if="data.value === 'Receive'" variant="warning"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
        <b-badge v-if="data.value === 'OnProgress'" variant="primary"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
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
      feedbackFields: [
        "complaint_id",
        { key: "date", sortable: true },
        "sender",
        "department",
        "subject / Complaint",
        { key: "status", label: "Status" }
      ],
      feedbacks: [
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
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback-customer/${row.complaint_id}`);
    }
  },
  computed: {
    rows() {
      return this.feedbacks.length;
    }
  }
};
</script>

<style scoped></style>
