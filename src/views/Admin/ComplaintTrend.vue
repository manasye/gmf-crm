<template>
  <b-container fluid class="container-app">
    <Header title="Complaint Trend"></Header>

    <b-row>
      <b-col cols="2">
        <label>Company</label>
        <b-form-select v-model="selectVal.company" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Status</label>
        <b-form-select v-model="selectVal.status" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Department</label>
        <b-form-select v-model="selectVal.department" :options="deptOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Year</label>
        <b-form-select v-model="selectVal.year" :options="yearOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Month</label>
        <b-form-select v-model="selectVal.month" :options="monthOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Range</label>
        <b-form-select v-model="selectVal.range" :options="rangeOptions"></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="chartData" :options="options"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";
import { departments, statusComplaints, months } from "@/utility/globalVar.js";

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
        status: null,
        year: null,
        company: null,
        department: null,
        month: null,
        range: null
      },
      statusOptions: statusComplaints,
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
        },
        ...departments
      ],
      monthOptions: months,
      rangeOptions: [
        {
          value: null,
          text: "All Range"
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
