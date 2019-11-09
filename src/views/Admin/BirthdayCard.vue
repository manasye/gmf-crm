<template>
  <b-container fluid class="container-app">
    <Header title="BIRTHDAY CARD"></Header>

    <b-row>
      <b-col cols="8">
        <div class="card-wrapper">
          <h5>SUBJECT</h5>
          <b-form-input v-model="subject" placeholder="Enter your subject"></b-form-input>
          <!--          <b-row class="mt-2">-->
          <!--            <b-col cols="10">-->
          <!--              <p style="font-size: .8rem" class="mb-0 ">-->
          <!--                Permalink : <a :href="permalink">{{ permalink }}</a>-->
          <!--              </p></b-col-->
          <!--            >-->
          <!--            <b-col cols="2" style="text-align: right">-->
          <!--              <b-button variant="success" size="sm" v-if="isAdmin()">Edit</b-button>-->
          <!--            </b-col>-->
          <!--          </b-row>-->

          <p class="mt-3 mb-2">Permalink</p>
          <b-form-input v-model="permalink" placeholder="Enter your subject"></b-form-input>

          <b-row>
            <b-col cols="6">
              <p class="mb-2 mt-4">Background</p>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRKAKaNFm-lamLybebUj-QRsq5IZ8egZXMWYQhlSBfJxFWBKo35"
                alt=""
                class="d-block"
              />
              <b-button variant="success" size="sm" class="mt-3" v-if="isAdmin()">Change</b-button>
            </b-col>
            <b-col cols="6">
              <p class="mb-2 mt-4">Preview</p>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRKAKaNFm-lamLybebUj-QRsq5IZ8egZXMWYQhlSBfJxFWBKo35"
                alt=""
                class="d-block"
              />
              <b-button variant="success" size="sm" class="mt-3">Preview</b-button>
            </b-col>
          </b-row>
        </div>
      </b-col>

      <b-col cols="4" v-if="isAdmin()">
        <b-button variant="success" size="sm" @ok="postBirthday">Send</b-button>
        <p style="font-size: .8rem" class="mt-3 ">
          *Birthday card will be sent automatically according to the customer's birthday. The
          customer's name will be taken from the name when registering customer's account.
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  data() {
    return {
      subject: "",
      permalink: ""
    };
  },
  methods: {
    postBirthday() {
      axios
        .post("/birthday/create", { subject: this.subject, permalink: this.permalink })
        .then(() => {
          swal("Success", "Birthday card will be sent", "success");
        })
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
