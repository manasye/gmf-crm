<template>
  <b-container fluid class="container-app">
    <Header :title="`Feedback ${$route.params.id}`" :breadcrumbs="breadcrumbs" />
    <div class="detail-header">
      <b-row>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p class="mb-1">Company</p>
          <p class="mb-0 font-weight-bold">{{ details.company_name || "-" }}</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p class="mb-1">Sender</p>
          <p class="mb-0 font-weight-bold">{{ details.sender || "-" }}</p>
        </b-col>
        <b-col cols="8" md="3" class="mb-3 mb-md-0">
          <p class="mb-1">Feedback Submitted</p>
          <p class="mb-0 font-weight-bold">{{ details.date || "-" }}</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1">Department</p>
          <p class="mb-0 font-weight-bold">{{ details.project_type || "-" }}</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1 mb-md-0">Rating</p>
          <star-rating
            :rating="details.rating || 0"
            read-only
            :show-rating="true"
            :star-size="25"
            :increment="0.5"
          />
        </b-col>
      </b-row>
    </div>

    <div class="detail-info">
      <div class="detail mt-3 mt-md-0">
        <h5 class="title">{{ details.project_type }}</h5>
        <p class="dept mb-2">Aspect(s) to improve</p>
        <ul style="padding-left: 16px">
          <li v-for="a in aspects" :key="a">{{ a }}</li>
        </ul>
      </div>
      <p class="font-weight-bold mt-4 mb-1">Remark</p>
      <p class="mb-0">
        {{ details.remark }}
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
      .get(`/feedbackproject/edit/${this.$route.params.id}`)
      .then(res => {
        this.details = res.data.data[0];
        this.aspects = res.data.data[0].aspect_to_improve.split(",");
      })
      .catch(() => {});
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Feedback List",
          href: `/#/feedback-list`
        },
        {
          text: `Feedback ${this.$route.params.id}`,
          active: true
        }
      ],
      rating: 5,
      details: {},
      aspects: []
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
.detail {
  border-left: 5px solid #13619a;
  padding-left: 20px;
  .title {
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  .dept {
    color: #13619a;
    font-weight: bold;
  }
}
</style>
