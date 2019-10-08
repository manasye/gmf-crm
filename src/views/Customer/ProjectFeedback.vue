<template>
  <div>
    <Header title="CUSTOMER FEEDBACK" :breadcrumbs="breadcrumbs"></Header>
    <div class="feedback-wrapper">
      <p>What service(s) did your company use for this project?</p>
      <b-form-checkbox-group>
        <b-row>
          <b-col cols="6" md="3" class="mb-2" v-for="(service, idx) in services" :key="idx">
            <b-form-checkbox
              :id="service.name"
              :name="service.name"
              v-model="serviceSelected"
              :value="idx"
              class="checkbox"
              >{{ service.name }}</b-form-checkbox
            ></b-col
          >
        </b-row>
      </b-form-checkbox-group>

      <p class="mt-2">How would you rate GMF performance?</p>
      <b-row>
        <b-col cols="12" md="4" v-for="p in performances" :key="p.title" class="mb-4 mb-md-0">
          <div class="feedback-wrapper">
            <h5 class="performance-title">{{ p.title }}</h5>
            <star-rating
              v-model="p.rating"
              :show-rating="false"
              class="performance-star"
              :star-size="35"
              :increment="0.5"
            ></star-rating>
            <p
              class="performance-result mt-2 font-weight-bold"
              v-if="p.rating"
              :class="generateResultRating(p.rating)[1]"
            >
              {{ generateResultRating(p.rating)[0] }}
            </p>
            <p class="mt-4"></p>
            <p>What aspect(s) do you think we could improve?</p>
            <b-form-checkbox-group>
              <b-form-checkbox
                v-for="(i, idx) in improvements"
                :key="i.name"
                class="checkbox"
                :id="i.name + p.title"
                :name="i.name + p.title"
                :value="idx"
                v-model="p.improvements"
              >
                {{ i.name }}
              </b-form-checkbox>
            </b-form-checkbox-group>
            <p class="mt-4">Remark / Other Comments</p>
            <b-form-textarea v-model="p.comment" rows="3" max-rows="6"></b-form-textarea>
          </div>
        </b-col>
      </b-row>

      <b-button variant="success" @click="submitFeedback" class="mt-md-4 submit-button mb-2"
        >SUBMIT</b-button
      >
    </div>
  </div>
</template>

<script>
import StarRating from "vue-star-rating";
import { departments } from "@/utility/globalVar";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Project List",
          href: "/#/project-customer"
        },
        {
          text: this.$route.params.id,
          href: `/#/project-customer/${this.$route.params.id}`
        },
        {
          text: "Customer Feedback",
          active: true
        }
      ],
      services: departments,
      serviceSelected: null,
      improvements: [
        { name: "Product Quality", value: "" },
        { name: "Quality Assurance Team", value: "" },
        { name: "On Team Delivery", value: "" },
        { name: "Personnel Competency & Capability", value: "" },
        { name: "Communication", value: "" }
      ],
      performances: [
        { title: "BASE MAINTENANCE", rating: 0, improvements: [], comment: null },
        { title: "CABIN MAINTENANCE", rating: 0, improvements: [], comment: null },
        { title: "ENGINEERING SERVICES", rating: 0, improvements: [], comment: null }
      ]
    };
  },
  components: {
    StarRating
  },
  methods: {
    submitFeedback() {},
    generateResultRating(rating) {
      if (rating >= 4) {
        return ["Satisfied", "text-success"];
      } else if (rating <= 2) {
        return ["Bad", "text-danger"];
      } else {
        return ["Enough", "text-warning"];
      }
    }
  }
};
</script>

<style scoped>
.feedback-wrapper {
  border: 1px solid #949699;
  padding: 15px 30px;
}
.checkbox {
  color: #13619a;
}
p {
  margin-bottom: 0.5rem;
}
.performance-title {
  color: #13619a;
  text-align: center;
  font-weight: bold;
}
.performance-result {
  text-align: center;
}
@media (max-width: 700px) {
  .feedback-wrapper {
    padding: 10px;
  }
  .checkbox {
    font-size: 0.9rem !important;
  }
}
</style>

<style>
.performance-star div {
  display: block !important;
  margin: 0 auto;
}
</style>
