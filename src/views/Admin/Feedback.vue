<template>
  <b-container fluid class="container-app">
    <Header title="Feedback List"></Header>
    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectedCompany" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedSender" :options="senderOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <b-form-select v-model="selectedProject" :options="projectOptions"></b-form-select>
      </b-col>

      <b-col cols="6" style="text-align: right">
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
      :items="feedbacks"
      :fields="feedbackFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showFeedback"
    >
      <template v-slot:cell(rating)="rate">
        <star-rating
          :rating="+rate.value"
          read-only
          :show-rating="false"
          :star-size="25"
          :increment="0.5"
          v-if="rate.value"
        ></star-rating>
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
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      selectedProject: null,
      selectedSender: null,
      selectedCompany: null,
      projectOptions: [],
      senderOptions: [],
      companyOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      feedbackFields: [
        { key: "feedback_id", sortable: true },
        { key: "date", sortable: true },
        { key: "company", sortable: true },
        { key: "sender", sortable: true },
        { key: "project_types", sortable: true },
        { key: "subject", sortable: true },
        { key: "rating", sortable: true }
      ],
      feedbacks: [
        {
          feedback_id: "CND",
          date: "23/7/19",
          company: "23/7/19",
          sender: "a",
          project_types: "a",
          subject: "aa",
          rating: "5"
        }
      ]
    };
  },
  methods: {
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback-admin/${row.feedback_id}`);
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
      return this.feedbacks.length;
    }
  },
  components: {
    StarRating
  }
};
</script>

<style scoped></style>
