<template>
  <b-container fluid class="container-app">
    <Header title="Messages"></Header>
    <div class="chat-container">
      <b-row no-gutters>
        <b-col cols="4" class="chat-left-container">
          <b-row style="padding: 10px 0" no-gutters>
            <b-col cols="12" class="pl-3 pr-3">
              <b-row no-gutters>
                <b-col cols="2">
                  <img
                    :src="
                      getUserImage()
                        ? getBaseStorage() + getUserImage()
                        : 'https://image.flaticon.com/icons/svg/172/172163.svg'
                    "
                    alt=""
                  />
                </b-col>
                <b-col cols="8"><p class="mb-0 ml-3" style="margin-top: .7rem">Admin</p></b-col>
                <b-col cols="2" style="text-align: right; margin-bottom: 35px"
                  ><font-awesome-icon
                    icon="plus-circle"
                    style="margin-top: .7rem; font-size: 20px;cursor: pointer;"
                    @click="showModal = true"
                  ></font-awesome-icon></b-col
              ></b-row>
            </b-col>
            <b-col cols="12" class="mb-4 pl-3 pr-3">
              <b-input-group>
                <b-form-input placeholder="Search..." v-model="search"></b-form-input>
              </b-input-group>
            </b-col>
            <div class="chat-left">
              <b-col
                cols="12"
                class="pl-3 chat-bubble pr-3 pt-2 pb-2"
                v-for="(chat, idx) in chats"
                :key="chat.user_name"
                :class="{ 'chat-active': activeChatId === chat.chat_id }"
                @click="viewChat(idx, chat)"
              >
                <b-row no-gutters>
                  <b-col cols="2"> <img :src="chat.user_img" alt=""/></b-col>
                  <b-col cols="8"
                    ><p class="mb-0 ml-3">{{ chat.user_name }}</p>
                    <p class="mb-0 ml-3" style="color: #949699">{{ chat.last_message }}</p></b-col
                  >
                  <b-col cols="2" style="text-align: right">
                    <p class="mb-0" :class="{ 'text-success': chat.unread }">{{ chat.time }}</p>
                    <b-badge v-if="chat.unread" pill variant="success">{{ chat.unread }}</b-badge>
                  </b-col></b-row
                >
              </b-col>
            </div>
          </b-row>
        </b-col>

        <b-col cols="8">
          <b-row no-gutters style="margin: 10px 0" v-if="activeChat">
            <b-col cols="12" class="pl-3 pr-3 mb-2">
              <b-row no-gutters>
                <b-col cols="1">
                  <img :src="activeChat.user_img" alt="" />
                </b-col>
                <b-col cols="9"
                  ><p class="mt-1 mb-0 ml-3">{{ activeChat.user_name }}</p>
                  <p class="mb-0 ml-3" style="color: #949699">aa</p></b-col
                >
                <b-col cols="2" style="text-align: right; margin-top: 10px"
                  ><b-button variant="danger" size="sm">CLOSE THREAD</b-button></b-col
                >
              </b-row>
            </b-col>
            <b-col cols="12" class="chat-content p-3" ref="content">
              <template v-for="c in activeChat.messages">
                <div class="in" :key="c.message_id" v-if="c.sender === 'admin'">
                  <p>
                    {{ c.message }}
                  </p>
                </div>
                <br v-if="c.sender === 'admin'" :key="c.message_id" />
                <div style="text-align: right" :key="c.message_id" v-if="c.sender !== 'admin'">
                  <div class="out">
                    <p>
                      {{ c.message }}
                    </p>
                  </div>
                </div>
              </template>
            </b-col>
            <b-col cols="10" class="pt-2 pl-3">
              <b-form-input
                placeholder="Write a message..."
                v-model="chat"
                @keyup.enter="sendMessage"
              ></b-form-input>
            </b-col>
            <b-col cols="1" class="pt-3 pl-3" style="text-align: center">
              <font-awesome-icon
                icon="link"
                size="lg"
                style="cursor: pointer; color: rgba(0,0,0,.6)"
                @click="fileUpload"
              ></font-awesome-icon
              ><b-form-file
                v-model="files"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                id="file"
                style="display: none"
                multiple
              ></b-form-file>
            </b-col>
            <b-col cols="1" class="pt-2" style="text-align: center">
              <img
                src="../../assets/img/send-button.png"
                alt=""
                class="send-button"
                @click="sendMessage"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>

    <b-modal
      v-model="showModal"
      centered
      @ok="sendNewMessage"
      title="Send New Message"
      v-if="showModal"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Customer Id</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.rcvr_id"></b-form-input> </b-col
        ><b-col cols="4"> <label class="mt-2">Message</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.message"></b-form-input> </b-col></b-row
    ></b-modal>
  </b-container>
</template>

<script>
import swal from "sweetalert";
import axios from "axios";
import moment from "moment";
const TIME_FETCH_INTERVAL = 5000;

export default {
  mounted() {
    this.getChats();
    this.chatInterval = setInterval(this.getChats, TIME_FETCH_INTERVAL);
  },
  beforeDestroy() {
    clearInterval(this.chatInterval);
  },
  data() {
    return {
      chats: null,
      activeChatId: null,
      activeChat: null,
      search: null,
      chat: null,
      files: [],
      showModal: false,
      editedData: { rcvr_id: "", message: "" },
      chatInterval: null
    };
  },
  methods: {
    fileUpload() {
      document.getElementById("file").click();
    },
    viewChat(idx, chat) {
      this.activeChatId = chat.chat_id;
      this.activeChat = this.chats[idx];
      this.clearChat();
    },
    moment: function() {
      return moment();
    },
    sendMessage() {
      axios
        .post("/messages/send", {
          user_id: this.getUserId(),
          message: this.chat,
          rcvr_id: this.activeChatId
        })
        .then(() => {
          this.getChats();
          this.chat = null;
          this.clearChat();
        })
        .catch(() => {});
    },
    sendNewMessage() {
      axios
        .post("/messages/send", {
          user_id: this.getUserId(),
          message: this.editedData.message,
          rcvr_id: this.editedData.rcvr_id
        })
        .then(() => {
          this.getChats();
        })
        .catch(() => {});
    },
    clearChat() {
      axios
        .get(`/messages/read/${this.getUserId()}/${this.activeChatId}`)
        .then(() => {
          this.activeChat.unread = 0;
        })
        .catch(() => {});
    },
    getChats() {
      axios
        .get(`/messages/get/${this.getUserId()}`)
        .then(res => {
          const data = res.data[0];
          let m = [];
          data.map(d => {
            for (let k in d) {
              const data = {
                chat_id: k,
                user_img: this.getUserImage() + d[k].image,
                user_name: d[k].name,
                last_message: this.shortenText(d[k].last_message.message, 20),
                time: moment(d[k].last_message.created_at).format("h:mm"),
                unread: d[k].unread_count,
                messages: d[k].messages
              };
              if (this.activeChatId === k) {
                this.activeChat = data;
              }
              m.push(data);
            }
          });
          this.chats = m;
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="scss">
.chat-container {
  border: 1px solid #949699;
}
img {
  width: 80%;
}
.chat-bubble {
  &:hover {
    background-color: #f1f1f1;
  }
  cursor: pointer;
}
.chat-active {
  background-color: #f1f1f1;
}
.chat-left-container {
  border-right: 1px solid #95999c;
}
.chat-left {
  height: 60vh;
  overflow-y: scroll;
  width: 100%;
}
.chat-content {
  background-color: #d5e2f3;
  height: 62vh;
  overflow-y: scroll;
  .in {
    background-color: #14609a;
    color: white;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
    margin-bottom: 20px;
    display: inline-block;
  }
  .out {
    width: auto;
    margin-left: auto;
    text-align: left;
    display: inline-block;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    max-width: 70%;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 0;
    display: inline-block;
  }
}
.send-button {
  width: 30px;
  margin-top: 5px;
  cursor: pointer;
}
</style>
