<template>
  <b-container fluid class="container-app">
    <Header title="NEW NON-PROJECT FEEDBACK" :breadcrumbs="breadcrumbs"></Header>
    <div class="feedback-wrapper">
      <p class="mb-2">Subject</p>
      <b-form-input v-model="subject" placeholder></b-form-input>
      <p class="mb-2 mt-4">Rating</p>
      <star-rating
        v-model="rating"
        :show-rating="false"
        class="performance-star"
        :star-size="35"
        :increment="0.5"
      ></star-rating>
      <p
        class="performance-result mt-2 font-weight-bold"
        v-if="rating"
        :class="generateResultRating(rating)[1]"
      >{{ generateResultRating(rating)[0] }}</p>
      <p class="mb-2 mt-4">Description</p>
      <b-form-textarea v-model="description" placeholder rows="3" max-rows="6"></b-form-textarea>
      <b-button variant="success" class="mt-4 mb-2">SUBMIT</b-button>
    </div>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";

export default {
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