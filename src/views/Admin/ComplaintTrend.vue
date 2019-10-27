<template>
  <b-container fluid class="container-app">
    <Header title="Complaint Trend"></Header>

    <b-row>
      <b-col cols="2">
        <label>Company</label>
        <b-form-select v-model="selectedCompany" :options="companyOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Status</label>
        <b-form-select v-model="selectedStatus" :options="statusOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Department</label>
        <b-form-select v-model="selectedDept" :options="deptOptions"></b-form-select>
      </b-col>
      <b-col cols="1">
        <label>Year</label>
        <b-form-select v-model="selectedYear" :options="yearOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Month</label>
        <b-form-select v-model="selectedMonth" :options="monthOptions"></b-form-select>
      </b-col>
      <b-col cols="2">
        <label>Range</label>
        <b-form-select v-model="selectedRange" :options="rangeOptions"></b-form-select>
      </b-col>
    </b-row>

    <line-chart class="mt-3" :chart-data="chartData" :options="options"></line-chart>
  </b-container>
</template>

<script>
import LineChart from "@/components/LineChart.vue";

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
      selectedStatus: null,
      selectedYear: null,
      selectedCompany: null,
      selectedDept: null,
      selectedMonth: null,
      selectedRange: null,
      statusOptions: [],
      yearOptions: [],
      companyOptions: [],
      deptOptions: [],
      monthOptions: [],
      rangeOptions: [],
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
