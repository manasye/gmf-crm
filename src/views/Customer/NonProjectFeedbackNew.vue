<template>
  <b-container fluid class="container-app" data-intro="Non Project New">
    <Header title="NEW NON-PROJECT FEEDBACK" :breadcrumbs="breadcrumbs" />
    <div class="feedback-wrapper">
      <p class="mb-2">Subject</p>
      <b-form-input v-model="subject" />
      <p class="mb-2 mt-4">Rating</p>
      <star-rating v-model="rating" :show-rating="true" :star-size="35" :increment="0.5" />
      <p
        class="performance-result mt-2 font-weight-bold"
        v-if="rating"
        :class="generateResultRating(rating)[1]"
      >
        {{ generateResultRating(rating)[0] }}
      </p>
      <p class="mb-2 mt-4">Description</p>
      <b-form-textarea v-model="description" rows="3" max-rows="6" />
      <b-button variant="success" class="mt-4 mb-2" @click="submitProject">SUBMIT</b-button>
    </div>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import axios from "axios";
import swal from "sweetalert";

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
          this.$store.commit("changeWalkthrough", false);
        });
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Non Project Feedback",
          href: `/#/feedback-customer-nonproject`
        },
        {
          text: "New Feedback",
          active: true
        }
      ],
      subject: null,
      description: null,
      rating: null
    };
  },
  methods: {
    generateResultRating(rating) {
      if (rating >= 4) {
        return ["Satisfied", "text-success"];
      } else if (rating <= 2) {
        return ["Bad", "text-danger"];
      } else {
        return ["Enough", "text-warning"];
      }
    },
    submitProject() {
      const data = {
        user_id: this.getUserId(),
        subject: this.subject,
        description: this.description,
        rating: this.rating
      };
      axios
        .post("/feedbacknonproject/create", data)
        .then(() => {
          swal("Success!", "You have successfully submitted a non project feedback!", "success");
          this.$store.dispatch("goToPage", "/feedback-customer-nonproject");
        })
        .catch(() => {});
    }
  },
  components: {
    StarRating
  }
};
</script>

<style lang="scss" scoped>
.feedback-wrapper {
  border: 1px solid #949699;
  padding: 10px 30px;
  margin-top: 10px;
}
</style>
