<template>
  <b-container fluid class="container-app">
    <Header title="Complaint Trend"></Header>

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
        <label>Month</label>
        <b-form-select
          v-model="selectVal.month"
          :options="monthOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Range</label>
        <b-form-select
          v-model="selectVal.range"
          :options="rangeOptions"
          @input="filtering"
        ></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="data" :options="options"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import { rangeOptions } from "@/utility/globalVar.js";
import axios from "axios";
import { departments } from "../../utility/globalVar";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: false
  },
  legend: {
    align: "center"
  }
};

export default {
  mounted() {
    axios
      .get("/complaint/filteroption")
      .then(res => {
        const filters = res.data;
        this.companyOptions = this.companyOptions.concat(filters.company_name);
        this.deptOptions = this.deptOptions.concat(filters.service);
        this.yearOptions = this.yearOptions.concat(filters.year);
        this.monthOptions = this.monthOptions.concat(filters.month);
        this.statusOptions = this.statusOptions.concat(filters.status);
      })
      .catch(() => {});

    this.postFilter({});
  },
  data() {
    return {
      selectVal: {
        status: null,
        year: null,
        company: null,
        department: null,
        month: null,
        range: null
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
      options,
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
        range: this.selectVal.range
      };
      if (!this.selectVal.range) {
        data = { ...data, year: this.selectVal.year, month: this.selectVal.month };
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
                label: "Amount of complaint",
                backgroundColor: Array(values.length).fill("#022f46"),
                data: values
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

<style scoped></style>
