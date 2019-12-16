<template>
  <b-container fluid class="container-app">
    <Header title="Feedback Trend"></Header>

    <b-row>
      <b-col cols="2">
        <label>Company</label>
        <b-form-select
          v-model="selectVal.company"
          :options="companyOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Rating</label>
        <b-form-select
          v-model="selectVal.rating"
          :options="ratingOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Project Type</label>
        <b-form-select
          v-model="selectVal.project_type"
          :options="projOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="1" v-if="!selectVal.range">
        <label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2" v-if="!selectVal.range">
        <label>Month</label>
        <b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="1">
        <label>Range</label>
        <b-form-select
          v-model="selectVal.range"
          :options="rangeOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Feedback Component</label>
        <b-form-select
          v-model="selectVal.feedback_component"
          :options="compOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="chartData" :options="trendOption"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import { ratingOptions, rangeOptions, trendOption } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/feedbackproject/filteroption")
      .then(res => {
        const filters = res.data;
        this.companyOptions = this.companyOptions.concat(filters.company_name);
        this.projOptions = this.projOptions.concat(filters.project_type);
        this.yearOptions = this.yearOptions.concat(filters.year);
        this.monthOptions = this.monthOptions.concat(filters.month);
        this.compOptions = this.compOptions.concat(filters.feedback_component);
      })
      .catch(() => {});

    this.postFilter({});
  },
  data() {
    return {
      trendOption,
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
        }
      ],
      monthOptions: [
        {
          value: null,
          text: "All Months"
        }
      ],
      rangeOptions,
      compOptions: [
        {
          value: null,
          text: "All Project Components"
        }
      ],
      chartData: null
    };
  },
  components: {
    LineChart
  },
  methods: {
    filtering() {
      let data = {
        company_name: this.selectVal.company,
        project_type: this.selectVal.project_type,
        range: this.selectVal.range,
        aspect_to_improve: this.selectVal.feedback_component,
        rating: +this.selectVal.rating
      };
      if (!this.selectVal.range) {
        data = { ...data, year: +this.selectVal.year, month: +this.selectVal.month };
      }
      this.postFilter(data);
    },
    postFilter(data) {
      axios
        .post("/complaint/filter", data)
        .then(res => {
          const data = res.data.trend;
          let keys = [],
            values = [];
          data.forEach(function(item) {
            Object.keys(item).forEach(function(key) {
              keys.push(key);
              values.push(item[key]);
            });
          });

          this.chartData = {
            ...this.chartData,
            labels: keys,
            datasets: [
              {
                label: "Amount of Feedback",
                backgroundColor: Array(values.length).fill("#13619a"),
                data: values,
                borderColor: "#13619a",
                pointBorderColor: "#13619a",
                pointBackgroundColor: "#13619a",
                pointHoverBackgroundColor: "#13619a",
                pointHoverBorderColor: "#13619a",
                fill: false
              }
            ]
          };
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped></style>
