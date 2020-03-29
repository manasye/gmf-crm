<template>
  <b-container fluid class="container-app">
    <Header title="BIRTHDAY CARD" />

    <b-row>
      <b-col cols="8">
        <div class="card-wrapper">
          <p class="mb-2">Subject</p>
          <b-form-input v-model="editedData.subject" placeholder="Enter your subject" />

          <p class="mt-3 mb-2">Permalink</p>
          <b-form-input v-model="editedData.permalink" placeholder="Enter your subject" />

          <b-row>
            <b-col cols="6">
              <p class="mt-4 mb-2">Background</p>
              <b-form-file
                v-model="editedData.image"
                placeholder="Upload Background"
                accept="image/*"
                @change="onFileChange"
                v-if="isAdmin()"
              />
              <img
                :src="urlBg"
                alt=""
                class="d-block"
                id="backgroundImage"
                @load="getSize"
                style="opacity: 0"
              />
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
                <div class="preview-text">
                  <h2>Happy Birthday</h2>
                  <h4>Customer Name</h4>
                  <p>Wishing you a wonderful birthday and a year filled with success</p>
                </div>
              </div>
              <b-button variant="success" size="sm" class="mt-2" @click="showModal = true"
                >Preview</b-button
              >
            </b-col>
          </b-row>
        </div>
      </b-col>

      <b-col cols="4" v-if="isAdmin()">
        <b-button variant="success" size="sm" @click="postBirthday">Send</b-button>
        <p style="font-size: .8rem" class="mt-3 ">
          *Birthday card will be sent automatically according to the customer's birthday. The
          customer's name will be taken from the name when registering customer's account. Maximum
          file size is 1 MB.
        </p>
      </b-col>
    </b-row>

    <b-modal centered v-model="showModal" hide-footer hide-header body-class="modal-no-padding">
      <div
        :style="{
          backgroundImage: `url(${urlBg})`,
          height: sizeImg + 'px'
        }"
        class="preview"
      >
        <div class="preview-text">
          <h2>Happy Birthday</h2>
          <h4>Customer Name</h4>
          <p>Wishing you a wonderful birthday and a year filled with success</p>
        </div>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    axios
      .get("/birthday/read")
      .then(res => {
        this.editedData = res.data.data[0];
      })
      .catch(() => {});
  },
  data() {
    return {
      editedData: {
        subject: "",
        permalink: "",
        image: null
      },
      urlBg: "",
      sizeImg: "",
      showModal: false
    };
  },
  methods: {
    postBirthday() {
      if (this.editedData.image.size > 1000000) {
        swal("Error", `File size exceeded 1MB`, "error");
        return;
      }
      let data = new FormData();
      data.set("subject", this.editedData.subject);
      data.set("image", this.editedData.image);
      data.set("permalink", this.editedData.permalink);
      data.set("id", this.editedData.birthday_card_id);

      axios
        .post("/birthday/update", data)
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
  padding: 0 30px;
  position: relative;
  background-size: 100% 100%;
}
.preview-text {
  position: absolute;
  top: 20%;
}
</style>
