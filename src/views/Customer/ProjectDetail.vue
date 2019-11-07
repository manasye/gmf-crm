<template>
  <b-container fluid class="container-app">
    <Header :title="title" :breadcrumbs="breadcrumbs" data-intro="aa"></Header>
    <div class="detail-header">
      <b-row>
        <b-col
          cols="4"
          md="2"
          v-for="(value, name, i) in header"
          class="mb-md-0"
          :class="{ 'mb-3': i === 1 }"
          :key="name"
        >
          <p class="mb-2">{{ convertSnakeCaseToText(name) }}</p>
          <p class="mb-0 font-weight-bold">{{ value || "-" }}</p>
        </b-col>
      </b-row>
    </div>
    <div class="detail-graph">
      <b-row>
        <b-col cols="12" md="6" class="mb-4">
          <p class="font-weight-bold">JOB CARD STATUS</p>
          <div class="chart-wrapper">
            <doughnut :chart-data="chartData" :options="options"></doughnut>
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mb-4">
          <p class="font-weight-bold">MDR STATUS</p>
          <div class="chart-wrapper">
            <doughnut :chart-data="chartData" :options="options"></doughnut>
          </div>
        </b-col>
        <b-col cols="12" md="6" class="mb-4">
          <p class="font-weight-bold">MRM STATUS</p>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import Doughnut from "@/components/DoughnutChart.vue";
import axios from "axios";
import { isAdmin } from "../../utility/func";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  }
};

export default {
  mounted() {
    if (this.$store.getters.walkthrough) {
      const introJS = require("intro.js");
      introJS
        .introJs()
        .start()
        .oncomplete(() => {
          this.$store.commit("changeWalkthrough", false);
        });
    } else {
      axios
        .get(`/project/edit/${this.$route.params.id}`)
        .then(res => {
          const data = res.data.data[0];
          this.title = data.name;
          this.breadcrumbs = [
            {
              text: "Project List",
              href: isAdmin() ? "/#/project" : "/#/project-customer"
            },
            {
              text: data.name,
              active: true
            }
          ];
          this.header = {
            company: data.company_name,
            est_start_date: data.start,
            est_finish_date: data.finish,
            location: "",
            quantity: data.quantity,
            project_type: data.project_type
          };
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      breadcrumbs: [],
      options,
      chartData: {
        labels: ["skill1"],
        datasets: [
          {
            backgroundColor: ["#000"],
            data: [1]
          }
        ]
      },
      title: "",
      header: {
        company: "",
        est_start_date: "",
        est_finish_date: "",
        location: "",
        type: "",
        project_type: ""
      }
    };
  },
  components: {
    Doughnut
  }
};
</script>

<style scoped lang="scss">
.detail-header {
  background-color: #13619a;
  color: white;
  padding: 10px 30px;
}
.detail-graph {
  border: 1px solid #949699;
  border-top: transparent;
  padding: 30px 30px;
  p {
    color: #13619a;
    font-size: 1rem;
  }
}
@media (max-width: 700px) {
  .detail-header,
  .detail-graph {
    padding: 10px;
  }
  .chart-wrapper {
    padding: 0 50px;
  }
}
</style>
