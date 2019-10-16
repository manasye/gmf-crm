<template>
  <b-container fluid class="container-app">
    <Header :title="`Feedback ${$route.params.id}`" :breadcrumbs="breadcrumbs"></Header>
    <div class="detail-header">
      <b-row>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p>Sender</p>
          <p class="mb-0 font-weight-bold">John</p>
        </b-col>
        <b-col cols="8" md="3" class="mb-md-0">
          <p>Feedback Submitted</p>
          <p class="mb-0 font-weight-bold">20 May 2019</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1 mb-md-2">Rating</p>
          <star-rating
            :rating="rating"
            read-only
            :show-rating="false"
            :star-size="25"
            :increment="0.5"
          ></star-rating>
        </b-col>
      </b-row>
    </div>

    <div class="detail-info">
      <h4 class="mb-3">Subject</h4>
      <p class="font-weight-bold mb-1">Description</p>
      <p
        class="mb-0"
      >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos perferendis enim aspernatur minus. Nihil mollitia ducimus, illum cumque ut minima, maiores quibusdam quis distinctio adipisci sapiente aperiam, doloremque est temporibus!</p>
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
          text: `Feedback ${this.$route.params.id}`,
          active: true
        }
      ],
      rating: 5
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