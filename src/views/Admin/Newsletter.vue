<template>
  <b-container fluid class="container-app">
    <Header title="NEWSLETTER"></Header>

    <b-row>
      <b-col cols="8">
        <div class="card-wrapper">
          <h5>SUBJECT</h5>
          <b-form-input v-model="subject" placeholder="Enter your subject"></b-form-input>
          <b-row class="mt-2">
            <b-col cols="10">
              <p style="font-size: .8rem" class="mb-0 ">
                Permalink : <a :href="permalink">{{ permalink }}</a>
              </p></b-col
            >
            <b-col cols="2" style="text-align: right">
              <b-button variant="success" size="sm">Edit</b-button>
            </b-col>
          </b-row>

          <p class="mb-2 mt-4">Preview</p>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRKAKaNFm-lamLybebUj-QRsq5IZ8egZXMWYQhlSBfJxFWBKo35"
            alt=""
            class="d-block"
          />
        </div>
      </b-col>

      <b-col cols="4">
        <b-button variant="success" size="sm">Edit</b-button>
        <br />
        <b-button variant="success" size="sm" class="mt-4">Send</b-button>
        <p style="font-size: .8rem" class="mt-3 ">
          *The newsletter will be sent immediately to customer's CRM application and email.
        </p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      subject: null,
      permalink: "https://drive.google.com/drive/folders/1vUr3tz9HMMkTOgoO0mb6SOMjWSZuilvg",
      sendDate: null
    };
  }
};
</script>

<style scoped>
.card-wrapper {
  border: 1px solid #95999c;
  padding: 16px 32px;
}
</style>
