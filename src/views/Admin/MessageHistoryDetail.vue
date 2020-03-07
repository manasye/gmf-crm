<template>
  <b-container fluid class="container-app">
    <Header title="Message List" />
    <div class="comments mb-3 mb-md-0" v-for="c in chats" :key="c.message_id">
      <b-row>
        <b-col cols="5">
          <h5>
            <b-badge pill variant="success" v-if="c.sender === 'admin'">Administrator</b-badge>
            <b-badge pill variant="primary" v-else>{{ c.sender }}</b-badge>
          </h5></b-col
        >
        <b-col cols="7" class="text-right">
          <p class="mb-0 text-secondary">{{ formatDate(c.created_at) }}</p></b-col
        ></b-row
      >
      <p v-if="c.type === 'text'">
        {{ c.message }}
      </p>
      <p v-else>
        <a :href="getBaseStorage() + c.message" target="_blank">File</a>
      </p>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  mounted() {
    axios
      .get(`/messages/history/${this.$route.params.id}`)
      .then(res => {
        this.chats = res.data.data;
      })
      .catch(() => {});
  },
  data() {
    return {
      chats: []
    };
  },
  methods: {
    formatDate(date) {
      return moment(date).format("lll");
    }
  }
};
</script>

<style scoped></style>
