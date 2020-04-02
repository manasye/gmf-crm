<template>
  <b-container fluid class="container-app">
    <Header title="Message History" subtitle="Chat list with the customers" />
    <b-table
      :fields="historyField"
      :items="histories"
      class="mb-3"
      show-empty
      empty-text=""
      @row-clicked="showDetail"
      striped
      responsive
    >
      <template v-slot:cell(last_message)="msg">
        <p v-if="msg.value.type === 'text'">{{ msg.value.message }}</p>
        <a :href="getBaseStorage() + msg.value.message" v-else target="_blank">File</a>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    this.getHistoryChats();
  },
  data() {
    return { historyField: ["date", "sender", "receiver", "last_message"], histories: [] };
  },
  methods: {
    showDetail(row) {
      this.$store.dispatch("goToPage", `/messages-history/${row.key}`);
    },
    getHistoryChats() {
      axios
        .get(`/messages/get/${this.getUserId()}?thread=close`)
        .then(res => {
          let histories = [];
          res.data.map(u => {
            u.map(ue => {
              for (const k in ue) {
                histories.push({
                  date: ue[k].last_message.created_at,
                  sender: ue[k].last_message.sender,
                  receiver: ue[k].last_message.receiver,
                  last_message: ue[k].last_message,
                  key: k
                });
              }
            });
          });
          this.histories = histories;
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped></style>
