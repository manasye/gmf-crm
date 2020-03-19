<template>
  <b-container fluid class="container-app" data-intro="Non Project">
    <Header title="NON-PROJECT FEEDBACK" />

    <b-row class="mt-0 mt-md-4">
      <b-col cols="6" md="2" class="mb-3 mb-md-0">
        <b-form-select v-model="selectVal.sender" :options="sendersOptions" />
      </b-col>
      <b-col cols="0" md="5" />
      <b-col cols="8" md="2" class="mt-2 text-md-right">Item per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
      <b-col cols="12" md="2" class="text-md-right mt-3 mt-md-0">
        <b-button
          variant="success"
          v-if="!isAdmin()"
          @click="$store.dispatch('goToPage', '/feedback-customer-new-nonproject')"
          >Add New Feedback</b-button
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
      <template v-slot:cell(remark)="data">
        {{ shortenText(data.value, 30) }}
      </template>
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
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" />
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import StarRating from "vue-star-rating";
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
          window.location.href = "/#/feedback-customer-new-nonproject";
          this.$store.commit("changeWalkthrough", true);
        });
    } else {
      let url = `/feedbacknonproject/read/${this.getCompanyId()}`;
      if (this.isAdmin()) url = "/feedbacknonproject/read";
      axios
        .get(url)
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
  },
  data() {
    return {
      sendersOptions: [
        {
          value: null,
          text: "All Senders"
        }
      ],
      selectVal: { sender: null },
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      feedbackFields: [
        { key: "feedback_nonproject_id", label: "Feedback ID", sortable: true },
        { key: "date", sortable: true },
        { key: "sender", sortable: true },
        { key: "subject", label: "Subject", sortable: true },
        { key: "rating", sortable: true }
      ],
      feedbacks: [],
      completed: false
    };
  },
  components: { StarRating },
  methods: {
    showFeedback(row) {
      this.$store.dispatch(
        "goToPage",
        `/feedback-customer-nonproject/${row.feedback_nonproject_id}`
      );
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
  }
};
</script>

<style lang="scss" scoped />
