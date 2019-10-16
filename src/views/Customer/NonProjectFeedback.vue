<template>
  <b-container fluid class="container-app">
    <Header title="NON-PROJECT FEEDBACK"></Header>

    <b-row class="mt-0 mt-md-4">
      <b-col cols="6" md="2" class="mb-3 mb-md-0">
        <b-form-select v-model="sender" :options="sendersOptions"></b-form-select>
      </b-col>
      <b-col cols="0" md="5"></b-col>
      <b-col cols="8" md="2" class="mt-2">Numbers of item per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
      </b-col>
      <b-col cols="12" md="2" class="text-md-right mt-3 mt-md-0">
        <b-button
          variant="success"
          @click="$store.dispatch('goToPage', '/feedback-customer-new-nonproject')"
        >Add New Feedback</b-button>
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

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import StarRating from "vue-star-rating";

export default {
  data() {
    return {
      sendersOptions: [],
      sender: null,
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      feedbackFields: [
        { key: "feedback_id", sortable: true },
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "subject", sortable: true },
        { key: "rating", sortable: true }
      ],
      feedbacks: [
        {
          feedback_id: "CND",
          date: "23/7/19",
          sender: "a",
          subject: "lorem",
          rating: 1
        }
      ]
    };
  },
  components: { StarRating },
  methods: {
    showFeedback(row) {
      this.$store.dispatch(
        "goToPage",
        `/feedback-customer-nonproject/${row.feedback_id}`
      );
    }
  },
  computed: {
    rows() {
      return this.feedbacks.length;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>