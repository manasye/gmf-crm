<template>
  <b-container fluid class="container-app" data-intro="Complaint">
    <Header
      title="COMPLAINT LIST"
      subtitle="List of Your Complaint about Garuda Maintenance Facility Performance"
    />

    <b-row class="mt-0 mt-md-4">
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.sender" :options="sendersOptions" />
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.service" :options="deptOptions" />
      </b-col>
      <b-col cols="6" md="2" class="mt-3 mt-md-0 mb-3 mb-md-0">
        <b-form-select v-model="selectVal.status" :options="statusOptions" />
      </b-col>
      <b-col cols="0" md="1" />
      <b-col cols="8" md="2" class="mt-2 text-md-right">Item per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
      <b-col cols="12" md="2" class="text-md-right mt-3 mt-md-0">
        <b-button variant="success" @click="$store.dispatch('goToPage', '/feedback-customer-new')"
          >Add New Complaint</b-button
        >
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :fields="feedbackFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showFeedback"
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
    if (this.$store.getters.walkthrough) {
      this.completed = false;
      const introJS = require("intro.js");
      introJS
        .introJs()
        .setOption("doneLabel", "Next page")
        .start()
        .onexit(() => {
          if (!this.completed) this.$store.commit("changeWalkthrough", false);
        })
        .oncomplete(() => {
          this.completed = true;
          window.location.href = "/#/feedback-customer-new";
          this.$store.commit("changeWalkthrough", true);
        });
    } else {
      axios
        .get(`/complaint/read/${this.getCompanyId()}`)
        .then(res => {
          this.feedbacks = res.data.data;
          let senders = [];
          res.data.data.map(p => {
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
          text: "All Services"
        },
        ...res
      ];
    });
  },
  data() {
    return {
      completed: false,
      sendersOptions: [
        {
          value: null,
          text: "All Senders"
        }
      ],
      deptOptions: [
        {
          value: null,
          text: "All Services"
        }
      ],
      statusOptions: statusComplaints,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      selectVal: { sender: null, service: null, status: null },
      feedbackFields: [
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "service", sortable: true },
        { key: "subject", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ],
      feedbacks: []
    };
  },
  methods: {
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback/${row.complaint_id}`);
    },
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
    }
  },
  computed: {
    rows() {
      return this.feedbacks.length;
    },
    filteredItems() {
      return this.feedbacks.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep = keep && (!this.selectVal[key] || item[key].includes(this.selectVal[key]));
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.feedbacks[0]);
    }
  }
};
</script>

<style scoped />
