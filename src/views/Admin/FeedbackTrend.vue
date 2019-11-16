<template>
  <b-container fluid class="container-app">
    <Header title="Feedback Trend"></Header>

    <b-row>
      <b-col cols="2">
        <label>Company</label>
        <b-form-select v-model="selectVal.company" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Rating</label>
        <b-form-select v-model="selectVal.rating" :options="ratingOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Project Type</label>
        <b-form-select v-model="selectVal.project_type" :options="projOptions"></b-form-select>
      </b-col>
      <b-col cols="1" v-if="!selectVal.range">
        <label>Year</label>
        <b-form-select v-model="selectVal.year" :options="yearOptions"></b-form-select>
      </b-col>
      <b-col cols="2" v-if="!selectVal.range">
        <label>Month</label>
        <b-form-select v-model="selectVal.month" :options="monthOptions"></b-form-select>
      </b-col>
      <b-col cols="1">
        <label>Range</label>
        <b-form-select v-model="selectVal.range" :options="rangeOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Feedback Component</label>
        <b-form-select
          v-model="selectVal.feedback_component"
          :options="compOptions"
        ></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="chartData" :options="options"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import { departments, months, ratingOptions, rangeOptions } from "@/utility/globalVar.js";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  }
};
export default {
  data() {
    return {
      selectVal: {
        rating: null,
        year: null,
        company: null,
        project_type: null,
        month: null,
        range: null,
        feedback_component: null
      },
      ratingOptions,
      yearOptions: [
        {
          value: null,
          text: "All Years"
        }
      ],
      companyOptions: [
        {
          value: null,
          text: "All Companies"
        }
      ],
      projOptions: [
        {
          value: null,
          text: "All Project Types"
        },
        ...departments
      ],
      monthOptions: months,
      rangeOptions,
      compOptions: [
        {
          value: null,
          text: "All Project Components"
        }
      ],
      options,
      chartData: {
        labels: Array(12).fill("Jan"),
        datasets: [
          {
            label: "Amount of complaint",
            backgroundColor: Array(12).fill("#000"),
            data: Array(12).fill(1)
          }
        ]
      }
    };
  },
  components: {
    LineChart
  }
};
</script>

<style scoped></style>
