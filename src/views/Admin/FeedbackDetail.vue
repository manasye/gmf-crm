<template>
  <b-container fluid class="container-app">
    <Header :title="`Feedback ${$route.params.id}`" :breadcrumbs="breadcrumbs"></Header>
    <div class="detail-header">
      <b-row>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p class="mb-1">Company</p>
          <p class="mb-0 font-weight-bold">John</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-3 mb-md-0">
          <p class="mb-1">Sender</p>
          <p class="mb-0 font-weight-bold">John</p>
        </b-col>
        <b-col cols="8" md="3" class="mb-3 mb-md-0">
          <p class="mb-1">Feedback Submitted</p>
          <p class="mb-0 font-weight-bold">20 May 2019</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1">Department</p>
          <p class="mb-0 font-weight-bold">Base Maintenance</p>
        </b-col>
        <b-col cols="4" md="2" class="mb-md-0">
          <p class="mb-1 mb-md-0">Rating</p>
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
      <div class="detail mt-3 mt-md-0">
        <h5 class="title">JUDUL</h5>
        <p class="dept mb-2">Aspect(s) to improve</p>
        <ul style="padding-left: 16px">
          <li v-for="i in 3">A</li>
        </ul>
      </div>
      <p class="font-weight-bold mb-1">Remark</p>
      <p class="mb-0">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos perferendis enim aspernatur
        minus. Nihil mollitia ducimus, illum cumque ut minima, maiores quibusdam quis distinctio
        adipisci sapiente aperiam, doloremque est temporibus!
      </p>
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
          text: "Feedback List",
          href: `/#/feedback-list`
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
