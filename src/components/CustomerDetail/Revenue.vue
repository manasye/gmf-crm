<template>
  <b-row>
    <b-col cols="4">
      <h5 class="mb-4">Revenue Highlight</h5>
      <b-row>
        <b-col cols="6" class="mt-2">
          <p class="mb-2">Start Date</p>
          <datepicker v-model="startDate" />
        </b-col>
        <b-col cols="6" class="mt-2">
          <p class="mb-2">End Date</p>
          <datepicker v-model="endDate"
        /></b-col>
      </b-row>

      <b-table class="mt-4" striped hover :items="revenues" show-empty></b-table>
    </b-col>
    <b-col cols="8">
      <b-button variant="success" size="sm" class="float-right" v-if="isAdmin()">EDIT</b-button>
      <h5>Past Marketing Activities</h5>
      <b-table class="mt-4" striped hover :items="activites" show-empty></b-table
    ></b-col>
  </b-row>
</template>

<script>
import Datepicker from "vuejs-datepicker";

export default {
  data() {
    return {
      startDate: new Date(),
      endDate: new Date(),
      revenues: [{ product: "airframe", sales: "aa" }],
      activites: [{ date: "a", activity: "a", remarks: "a" }]
    };
  },
  components: {
    Datepicker
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
