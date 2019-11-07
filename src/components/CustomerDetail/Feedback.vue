<template>
  <div>
    <h5 style="font-weight: bold">FEEDBACK LIST</h5>
    <b-row class="mt-4">
      <b-col cols="6" md="2">
        <b-form-select v-model="sender" :options="sendersOptions"></b-form-select>
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="project" :options="projectOptions"></b-form-select>
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
  </div>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      axios
        .get(`/feedbackproject/read/${this.$route.params.id}`)
        .then(({ data }) => {
          this.feedbacks = data.data;
        })
        .catch(() => {});
    }
  },

  data() {
    return {
      sendersOptions: [],
      projectOptions: [],
      statusOptions: [],
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      sender: null,
      project: null,
      status: null,
      feedbackFields: [
        { key: "feedback_project_id", label: "Id", sortable: true },
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "location", sortable: true },
        { key: "project_type", sortable: true },
        { key: "rating", sortable: true }
      ],
      feedbacks: []
    };
  },
  components: {
    StarRating
  },
  methods: {
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback-admin/${row.feedback_project_id}`);
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
