<template>
  <b-container fluid class="container-app">
    <Header :title="title" :breadcrumbs="breadcrumbs"></Header>

    <b-row>
      <b-col cols="8">
        <div class="card-wrapper">
          <h5>SUBJECT</h5>
          <b-form-input v-model="subject" placeholder="Enter your subject"></b-form-input>
          <b-row class="mt-2">
            <b-col cols="10">
              <p style="font-size: .8rem" class="mb-0 ">
                Permalink : <a :href="detail.permalink">{{ detail.permalink }}</a>
              </p></b-col
            >
            <b-col cols="2" style="text-align: right">
              <b-button variant="success" size="sm" v-if="isAdmin()" @click="showEdit = true"
                >Edit</b-button
              >
            </b-col>
          </b-row>

          <p class="mb-2 mt-4">Preview</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRKAKaNFm-lamLybebUj-QRsq5IZ8egZXMWYQhlSBfJxFWBKo35"
            alt=""
            class="d-block"
          />
          <b-button variant="success" size="sm" class="mt-3">Change</b-button>
        </div>
      </b-col>

      <b-col cols="4" v-if="isAdmin()">
        <p class="mb-2">Send Date</p>
        <datepicker v-model="sendDate"></datepicker>
        <b-button variant="success" size="sm" class="mt-4">Send</b-button>
        <p style="font-size: .8rem" class="mt-3 ">
          *Holiday cards will be sent automatically according to the holiday's date and customer's
          religion
        </p>
      </b-col>
    </b-row>

    <b-modal v-model="showEdit" centered size="lg" @ok="editCard" v-if="showEdit">
      <b-row>
        <b-col cols="3"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="9" class="mb-3">
          <b-form-input v-model="detail.permalink"></b-form-input> </b-col
      ></b-row>
    </b-modal>
  </b-container>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import swal from 'sweetalert'

export default {
  mounted() {
    axios
      .get(`/religion/edit/${this.$route.params.id}`)
      .then(res => {
        const data = res.data.data[0];
        this.title = data.subject;
        this.subject = data.subject;
        this.detail = data;
        this.breadcrumbs = [
          {
            text: "Holiday Card",
            href: "/#/information-holiday-card"
          },
          {
            text: data.subject,
            active: true
          }
        ];
      })
      .catch(() => {});
  },
  data() {
    return {
      breadcrumbs: [],
      subject: null,
      sendDate: null,
      title: null,
      showEdit: false,
      detail: {}
    };
  },
  components: {
    Datepicker
  },
  methods: {
    editCard() {
      axios
        .post("/religion/update", this.detail)
        .then(res => {})
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    }
  }
};
</script>

<style scoped>
.card-wrapper {
  border: 1px solid #95999c;
  padding: 16px 32px;
}
</style>
