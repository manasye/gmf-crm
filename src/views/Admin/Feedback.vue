<template>
  <b-container fluid class="container-app">
    <Header title="Feedback List" subtitle="Post-project performance ratings from customers" />
    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectVal.company_name" :options="companyOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.sender" :options="senderOptions" />
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectVal.project_type" :options="projectOptions" />
      </b-col>

      <b-col cols="6" style="text-align: right">
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
      :fields="feedbackFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showFeedback"
      show-empty
      empty-text=""
    >
      <template v-slot:cell(rating)="rate">
        <star-rating
          :rating="+rate.value"
          read-only
          :show-rating="true"
          :star-size="25"
          :increment="0.5"
          v-if="rate.value"
        />
      </template>
      <template v-slot:cell(remark)="data">
        {{ shortenText(data.value, 20) }}
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />
  </b-container>
</template>

<script>
import { perPageOptions, departments } from "@/utility/globalVar.js";
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/feedbackproject/read")
      .then(res => {
        this.feedbacks = res.data.data;
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
      this.projectOptions = [
        {
          value: null,
          text: "All Project Type"
        },
        ...res
      ];
    });

    axios
      .get("/admin/readfeedback")
      .then(() => {})
      .catch(() => {});
  },
  data() {
    return {
      selectVal: {
        project_type: null,
        sender: null,
        company_name: null
      },
      projectOptions: [
        {
          value: null,
          text: "All Project Types"
        }
      ],
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
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      feedbackFields: [
        { key: "date", sortable: true },
        { key: "company_name", sortable: true },
        { key: "sender", sortable: true },
        { key: "project_type", label: "Project Type", sortable: true },
        { key: "remark", label: "Subject", sortable: true },
        { key: "rating", sortable: true }
      ],
      feedbacks: []
    };
  },
  methods: {
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback-admin/${row.feedback_project_id}`);
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
          keep = keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.feedbacks[0]);
    }
  },
  components: {
    StarRating
  }
};
</script>

<style scoped />
