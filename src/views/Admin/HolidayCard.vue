<template>
  <b-container fluid class="container-app">
    <Header title="Holiday Card List"></Header>

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectedReligion" :options="religionOptions"></b-form-select>
      </b-col>
      <b-col cols="4">
        <b-button variant="success" @click="showModal = true">Add New Holiday Card</b-button>
      </b-col>
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
      show-empty
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

    <b-modal centered v-model="showModal" @ok="addCard">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Subject</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.subject"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.image"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.date"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Religion</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.religion"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.permalink"></b-form-input> </b-col
      ></b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    this.getCards();
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
      cards: [],
      showModal: false,
      editedData: {
        subject: "",
        image: "",
        date: "",
        religion: "",
        permalink: ""
      }
    };
  },
  methods: {
    showCard(row) {
      this.$store.dispatch("goToPage", `/information-holiday-card/${row.religion_card_id}`);
    },
    addCard() {
      axios
        .post("/religion/create")
        .then(res => {
          this.getCards();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getCards() {
      axios
        .get("/religion/read")
        .then(res => {
          this.cards = res.data.data;
        })
        .catch(() => {});
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
