<template>
  <b-container fluid class="container-app">
    <Header title="CUSTOMER FEEDBACK" :breadcrumbs="breadcrumbs" />
    <div class="feedback-wrapper">
      <p>What service(s) did your company use for this project?</p>
      <b-form-checkbox-group @input="changeService">
        <b-row>
          <b-col cols="6" md="3" class="mb-2" v-for="(service, idx) in services" :key="idx">
            <b-form-checkbox
              :id="service.name"
              :name="service.name"
              v-model="serviceSelected"
              :value="service.name"
              class="checkbox"
              >{{ service.name }}</b-form-checkbox
            ></b-col
          >
        </b-row>
      </b-form-checkbox-group>

      <p class="mt-2">How would you rate GMF performance?</p>
      <b-row>
        <b-col cols="12" md="4" v-for="p in performances" :key="p.service" class="mb-4 mb-md-0">
          <div class="feedback-wrapper">
            <h5 class="performance-title">{{ p.service }}</h5>
            <star-rating
              v-model="p.rating"
              :show-rating="true"
              class="performance-star"
              :star-size="35"
              :increment="0.5"
            />
            <p
              class="performance-result mt-2 font-weight-bold"
              v-if="p.rating"
              :class="generateResultRating(p.rating)[1]"
            >
              {{ generateResultRating(p.rating)[0] }}
            </p>
            <p class="mt-4" />
            <p>What aspect(s) do you think we could improve?</p>
            <b-form-checkbox-group>
              <b-form-checkbox
                v-for="i in improvements"
                :key="i.name"
                class="checkbox"
                :id="i.name + p.service"
                :name="i.name + p.service"
                :value="i.value"
                v-model="p.aspect_to_improve"
              >
                {{ i.name }}
              </b-form-checkbox>
            </b-form-checkbox-group>
            <p class="mt-4">Remark / Other Comments</p>
            <b-form-textarea v-model="p.remark" rows="3" max-rows="6" />
          </div>
        </b-col>
      </b-row>

      <p v-if="performances.length === 0" class="mb-0">No Service Selected</p>

      <b-button variant="success" @click="submitFeedback" class="mt-md-4 submit-button mb-2"
        >SUBMIT</b-button
      >
    </div>
  </b-container>
</template>

<script>
import StarRating from "vue-star-rating";
import { departments } from "@/utility/globalVar";
import axios from "axios";

export default {
  mounted() {
    axios
      .get(`/project/edit/${this.$route.params.id}`)
      .then(res => {
        const data = res.data.data[0];
        this.breadcrumbs = [
          {
            text: "Project List",
            href: "/#/project-customer"
          },
          {
            text: data.name,
            href: `/#/project-customer/${this.$route.params.id}`
          },
          {
            text: "Customer Feedback",
            active: true
          }
        ];
        this.projectType = data.project_type;
        if (this.projectType === "Line Maintenance") {
          this.serviceSelected = ["Outstation Line Maintenance", "Component Services"];
        }
      })
      .catch(() => {});

    departments().then(res => {
      this.services = res;
    });
  },
  data() {
    return {
      breadcrumbs: [],
      services: [],
      serviceSelected: null,
      improvements: [
        { name: "Product Quality", value: "Product Quality" },
        { name: "Quality Assurance Team", value: "Quality Assurance Team" },
        { name: "On Team Delivery", value: "On Team Delivery" },
        { name: "Personnel Competency & Capability", value: "Personnel Competency & Capability" },
        { name: "Communication", value: "Communication" }
      ],
      performances: [],
      projectType: ""
    };
  },
  components: {
    StarRating
  },
  methods: {
    submitFeedback() {
      const feedbacks = this.performances.map(p => ({
        ...p,
        aspect_to_improve: p.aspect_to_improve.join(",")
      }));

      axios
        .post("/feedbackproject/create", {
          user_id: this.getUserId(),
          project_id: this.$route.params.id,
          service: feedbacks
        })
        .then(() => {
          swal("Success", "Feedback submitted successfully", "success");
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    generateResultRating(rating) {
      if (rating >= 4) {
        return ["Satisfied", "text-success"];
      } else if (rating <= 2) {
        return ["Bad", "text-danger"];
      } else {
        return ["Enough", "text-warning"];
      }
    },
    changeService(services) {
      let performances = [];
      services.map(s => {
        const performance = this.performances.find(p => p.service === s);
        if (!performance)
          performances.push({ service: s, rating: 0, aspect_to_improve: [], remark: "" });
        else performances.push(performance);
      });
      this.performances = performances;
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
  text-transform: uppercase;
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
