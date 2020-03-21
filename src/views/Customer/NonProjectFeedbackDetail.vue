<template>
  <b-container fluid class="container-app">
    <Header :title="`Feedback ${$route.params.id}`" :breadcrumbs="breadcrumbs" />
    <div class="detail-header">
      <b-row>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p class="mb-1 mb-md-2">Sender</p>
          <p class="mb-0 font-weight-bold">{{ sender }}</p>
        </b-col>
        <b-col cols="8" md="3" class="mb-md-0">
          <p class="mb-1 mb-md-2">Feedback Submitted</p>
          <p class="mb-0 font-weight-bold">{{ submitted }}</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1 mb-md-2">Rating</p>
          <star-rating
            :rating="rating"
            read-only
            :show-rating="true"
            :star-size="25"
            :increment="0.5"
          />
        </b-col>
      </b-row>
    </div>

    <div class="detail-info">
      <h4 class="mb-3">{{ subject }}</h4>
      <p class="font-weight-bold mb-1">Description</p>
      <p class="mb-0">
        {{ description }}
      </p>
    </div>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import axios from "axios";

export default {
  mounted() {
    axios
      .get(`/feedbacknonproject/edit/${this.$route.params.id}`)
      .then(res => {
        const data = res.data.data[0];
        this.sender = data.sender;
        this.rating = data.rating;
        this.submitted = data.date;
        this.subject = data.subject;
        this.description = data.description;
      })
      .catch(() => {});
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Non Project Feedback",
          href: `/#/feedback-nonproject`
        },
        {
          text: `Feedback ${this.$route.params.id}`,
          active: true
        }
      ],
      rating: 5,
      sender: "",
      submitted: "",
      subject: "",
      description: ""
    };
  },
  components: {
    StarRating
  }
};
</script>

<style lang="scss" scoped>
.detail-header {
  background-color: #13619a;
  color: white;
  padding: 10px 30px;
}
.detail-info {
  border: 1px solid #949699;
  border-top: transparent;
  padding: 30px 30px;
}
@media (max-width: 700px) {
  .detail-header,
  .detail-info {
    padding: 10px;
  }
}
</style>
