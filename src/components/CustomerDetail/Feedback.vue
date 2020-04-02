<template>
  <div>
    <h5 style="font-weight: bold">FEEDBACK LIST</h5>
    <b-row class="mt-4">
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.sender" :options="sendersOptions" />
      </b-col>
      <b-col cols="6" md="2">
        <b-form-select v-model="selectVal.project_type" :options="projectOptions" />
      </b-col>
      <b-col cols="0" md="5" />
      <b-col cols="8" md="2" class="mt-2 text-md-right">Per page</b-col>
      <b-col cols="4" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions" />
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
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />
  </div>
</template>

<script>
import { perPageOptions, departments } from "@/utility/globalVar.js";
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      axios
        .get(`/feedbackproject/read/${this.$route.params.id}`)
        .then(({ data }) => {
          this.feedbacks = data.data;
          let senders = [];
          data.data.map(p => {
            if (!senders.find(l => l.value === p.sender) && p.sender) {
              senders.push({ value: p.sender, text: p.sender });
            }
          });
          this.sendersOptions = this.sendersOptions.concat(senders);
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
      projectOptions: [
        {
          value: null,
          text: "All Project Types"
        }
      ],
      statusOptions: [],
      perPageOptions,
      perPage: "10",
      currentPage: 1,
      selectVal: {
        sender: null,
        project_type: null
      },
      feedbackFields: [
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

<style scoped />
