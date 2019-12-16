<template>
  <b-container fluid class="container-app">
    <Header :title="subject" :breadcrumbs="breadcrumbs" />

    <b-row>
      <b-col cols="8">
        <div class="card-wrapper">
          <h5>SUBJECT</h5>
          <b-form-input v-model="subject" placeholder="Enter your subject" />
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
          <img :src="url || `${getBaseStorage()}${detail.image}`" alt="" class="d-block" />
          <b-form-file
            v-model="detail.image"
            placeholder="Change Image"
            accept="image/*"
            @change="onFileChange"
            class="mt-3"
          />
        </div>
      </b-col>

      <b-col cols="4" v-if="isAdmin()">
        <p class="mb-2">Send Date</p>
        <datepicker v-model="sendDate" :format="customFormatter" />
        <b-button variant="success" size="sm" class="mt-4" @click="editCard">Send</b-button>
        <p style="font-size: .8rem" class="mt-3 ">
          *Holiday cards will be sent automatically according to the holiday's date and customer's
          religion
        </p>
      </b-col>
    </b-row>

    <b-modal v-model="showEdit" centered size="lg" v-if="showEdit">
      <b-row>
        <b-col cols="3"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="9" class="mb-3"> <b-form-input v-model="detail.permalink" /> </b-col
      ></b-row>
    </b-modal>
  </b-container>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";

export default {
  mounted() {
    axios
      .get(`/religion/edit/${this.$route.params.id}`)
      .then(res => {
        const data = res.data.data[0];
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
      showEdit: false,
      detail: {},
      url: ""
    };
  },
  components: {
    Datepicker
  },
  methods: {
    editCard() {
      let data = new FormData();
      if (this.detail.image instanceof File) data.set("image", this.detail.image);
      data.set("date", moment(this.sendDate).format("YYYY-MM-DD"));
      data.set("permalink", this.detail.permalink);
      data.set("religion_card_id", this.detail.religion_card_id);
      data.set("subject", this.detail.subject);
      data.set("religion", this.detail.religion);

      axios
        .post("/religion/update", data)
        .then(() => {
          swal("Success", "Holiday card successfully updated", "success");
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    customFormatter(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    moment: function() {
      return moment();
    },
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
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
