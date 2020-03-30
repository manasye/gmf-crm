<template>
  <b-container fluid class="container-app">
    <Header
      title="Complaint Trend"
      subtitle="Garuda Maintenance Facility Performance Graph by Client Complaint"
    ></Header>

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
        <label>Status</label>
        <b-form-select
          v-model="selectVal.status"
          :options="statusOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Department</label>
        <b-form-select
          v-model="selectVal.department"
          :options="deptOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2" v-if="!selectVal.range">
        <label>Year</label>
        <b-form-select
          v-model="selectVal.year"
          :options="yearOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2" v-if="!selectVal.range">
        <label>Semester</label>
        <b-form-select
          v-model="selectVal.semester"
          :options="semesterOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="data" :options="trendOption"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import { rangeOptions, trendOption, semesterOptions, departments } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/complaint/filteroption")
      .then(res => {
        const filters = res.data;
        this.companyOptions = this.companyOptions.concat(filters.company_name);
        departments().then(res => {
          this.deptOptions = [
            {
              value: null,
              text: "All Departments"
            },
            ...res
          ];
        });
        this.yearOptions = this.yearOptions.concat(filters.year);
        this.monthOptions = this.monthOptions.concat(filters.month);
        this.statusOptions = this.statusOptions.concat(filters.status);
      })
      .catch(() => {});

    this.postFilter({});
  },
  data() {
    return {
      trendOption,
      selectVal: {
        status: null,
        year: null,
        company: null,
        department: null,
        semester: null
      },
      statusOptions: [
        {
          value: null,
          text: "All Status"
        }
      ],
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
      deptOptions: [
        {
          value: null,
          text: "All Departments"
        }
      ],
      monthOptions: [
        {
          value: null,
          text: "All Months"
        }
      ],
      rangeOptions,
      semesterOptions: [
        {
          value: null,
          text: "All Semesters"
        },
        ...semesterOptions
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
        status: this.selectVal.status,
        company_name: this.selectVal.company,
        service: this.selectVal.department,
        range: this.selectVal.range,
        semester: this.selectVal.semester
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
                label: "Amount of Complaint",
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
  },
  computed: {
    data: function() {
      return this.chartData;
    }
  }
};
</script>
