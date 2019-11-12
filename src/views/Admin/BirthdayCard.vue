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
              <img :src="urlBg" alt="" class="d-block" id="backgroundImage" @load="getSize" />
              <b-form-file
                v-model="fileBg"
                placeholder="Change Background"
                accept="image/*"
                @change="onFileChange"
                class="mt-2"
                v-if="isAdmin()"
              ></b-form-file>
            </b-col>
            <b-col cols="6" v-if="urlBg">
              <p class="mb-2 mt-4">Preview</p>
              <div
                :style="{
                  backgroundImage: `url(${urlBg})`,
                  height: sizeImg + 'px'
                }"
                class="preview"
              >
                <h2>Happy Birthday</h2>
                <h4>Customer Name</h4>
                <p>Wishing you a wonderful birthday and a year filled with success</p>
              </div>
              <b-button variant="success" size="sm" class="mt-2">Preview</b-button>
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
      permalink: "",
      fileBg: null,
      urlBg: "",
      sizeImg: ""
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
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.urlBg = URL.createObjectURL(file);
      const self = this;

      // const fr = new FileReader();
      // fr.onload = function() {
      //   // file is loaded
      //   const img = new Image();
      //   img.onload = function() {
      //     self.sizeImg = img.height; // image is loaded; sizes are available
      //   };
      //   img.src = fr.result; // is the data URL because called with readAsDataURL
      // };
      // fr.readAsDataURL(file); // I'm using a <input type="file"> for demonstrating
    },
    getSize() {
      this.sizeImg = document.getElementById("backgroundImage").clientHeight;
    }
  }
};
</script>

<style scoped lang="scss">
.card-wrapper {
  border: 1px solid #95999c;
  padding: 16px 32px;
}
.preview {
  color: white;
  text-align: center;
  padding: 75px 30px 150px 30px;
  background-size: 100% 100%;
}
</style>
