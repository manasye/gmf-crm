<template>
  <b-container fluid class="container-app">
    <Header title="Holiday Card List"></Header>

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectedReligion" :options="religionOptions"></b-form-select>
      </b-col>
      <b-col cols="4"></b-col>
      <b-col cols="6" style="text-align: right">
        <b-row>
          <b-col cols="10" class="d-none d-md-block">
            <p class="mt-2">Number of items per page</p>
          </b-col>
          <b-col cols="2">
            <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
          </b-col> </b-row></b-col
    ></b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="cards"
      :per-page="perPage"
      :fields="cardField"
      :current-page="currentPage"
      responsive
      @row-clicked="showCard"
    >
      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      >
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      align="right"
    ></b-pagination>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import axios from "axios";

export default {
  mounted() {
    axios
      .get("/religion/read")
      .then(res => {
        this.cards = res.data.data;
      })
      .catch(() => {});
  },
  data() {
    return {
      selectedReligion: null,
      religionOptions: [],
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      cardField: [
        { key: "subject", sortable: true },
        { key: "image", sortable: true },
        { key: "religion", sortable: true },
        { key: "date", sortable: true },
        { key: "permalink", sortable: true }
      ],
      cards: []
    };
  },
  methods: {
    showCard(row) {
      this.$store.dispatch("goToPage", `/information-holiday-card/${row.religion}`);
    }
  },
  computed: {
    rows() {
      return this.cards.length;
    }
  }
};
</script>

<style scoped></style>
