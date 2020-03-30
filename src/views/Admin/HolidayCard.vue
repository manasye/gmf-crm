<template>
  <b-container fluid class="container-app">
    <Header
      title="Holiday Card List"
      subtitle="Congratulate Garuda Maintenance Facility Client on their Holiday"
    />

    <b-row>
      <b-col cols="2">
        <b-form-select v-model="selectVal.religion" :options="religionOptions" />
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
            <b-form-select v-model="perPage" :options="perPageOptions" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="filteredItems"
      :per-page="perPage"
      :fields="cardField"
      :current-page="currentPage"
      responsive
      @row-clicked="showCard"
      show-empty
    >
      <template v-slot:cell(image)="data"
        ><img :src="getBaseStorage() + data.value" alt="" style="width: 70%"
      /></template>

      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      >

      <template v-slot:cell(edit)="data">
        <font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="pen"
          style="cursor: pointer"
          @click.stop="editCard(data.item)"/>&nbsp;&nbsp;
        <font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="trash"
          style="cursor: pointer"
          @click.stop="removeCard(data.item)"
      /></template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />

    <b-modal centered v-model="showModal" @ok="addCard" title="Add Holiday Card">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Subject</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.subject" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file v-model="editedData.image" placeholder="Enter image" accept="image/*" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Date</label></b-col>
        <b-col cols="8" class="mb-3">
          <datepicker v-model="editedData.date" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Religion</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="editedData.religion"
            :options="religionOptions.slice(1, religionOptions.length)"
            placeholder="Select religion"
          />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedData.permalink" /> </b-col
      ></b-row>
    </b-modal>
  </b-container>
</template>

<script>
import { perPageOptions, religions } from "@/utility/globalVar.js";
import axios from "axios";
import swal from "sweetalert";
import Datepicker from "vuejs-datepicker";
import moment from "moment";

export default {
  mounted() {
    this.getCards();
    if (!this.isAdmin()) this.cardField.pop();
  },
  data() {
    return {
      selectVal: {
        religion: null
      },
      religionOptions: religions,
      currentPage: 1,
      perPageOptions,
      perPage: "10",
      cardField: [
        { key: "subject", sortable: true },
        { key: "image", sortable: true, class: "w-25" },
        { key: "religion", sortable: true },
        { key: "date", sortable: true },
        { key: "permalink", sortable: true },
        "edit"
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
    moment: function() {
      return moment();
    },
    showCard(row) {
      this.$store.dispatch("goToPage", `/information-holiday-card/${row.religion_card_id}`);
    },
    addCard() {
      let formData = new FormData();
      const data = this.editedData;
      if (data.image.size > 1000000) {
        swal("Error", `File size exceeded 1MB`, "error");
        return;
      }
      let url = "/religion/create";
      let action = "created";

      formData.set("subject", data.subject);
      if (data.image instanceof File) formData.set("image", data.image);
      formData.set("date", moment(data.date).format("YYYY-MM-DD"));
      formData.set("religion", data.religion);
      formData.set("permalink", data.permalink);

      if (data.religion_card_id) {
        url = "/religion/update";
        formData.set("religion_card_id", data.religion_card_id);
        action = "updated";
      }

      axios
        .post(url, formData)
        .then(() => {
          swal("Success", `Holiday card successfully ${action}`, "success");
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
    },
    removeCard(card) {
      axios
        .get(`/religion/delete/${card.religion_card_id}`)
        .then(() => this.getCards())
        .catch(() => {});
    },
    editCard(card) {
      this.showModal = true;
      this.editedData = card;
    }
  },
  computed: {
    rows() {
      return this.cards.length;
    },
    filteredItems() {
      return this.cards.filter(item => {
        let keep = true;
        this.fieldKeys.forEach(key => {
          keep = keep && (!this.selectVal[key] || item[key] === this.selectVal[key]);
        });
        return keep;
      });
    },
    fieldKeys() {
      return Object.keys(this.cards[0]);
    }
  },
  components: {
    Datepicker
  }
};
</script>

<style scoped />
