<template>
  <div>
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="false"
      :showFile="true"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
      ><template v-slot:header>
        <img
          :src="participants[0].imageUrl"
          alt=""
          class="sc-header--img thumbnail-chat"
        /> </template
    ></beautiful-chat>
  </div>
</template>

<script>
import CloseIcon from "vue-beautiful-chat/src/assets/close-icon.png";
import OpenIcon from "vue-beautiful-chat/src/assets/logo-no-bg.svg";
import FileIcon from "vue-beautiful-chat/src/assets/file.svg";
import CloseIconSvg from "vue-beautiful-chat/src/assets/close.svg";
import axios from "axios";
const TIME_FETCH_INTERVAL = 5000;

export default {
  mounted() {
    this.getChats();
    this.chatInterval = setInterval(this.getChats, TIME_FETCH_INTERVAL);
  },
  beforeDestroy() {
    clearInterval(this.chatInterval);
  },
  name: "Chat",
  data() {
    return {
      chatInterval: null,
      icons: {
        open: {
          img: OpenIcon,
          name: "default"
        },
        close: {
          img: CloseIcon,
          name: "default"
        },
        file: {
          img: FileIcon,
          name: "default"
        },
        closeSvg: {
          img: CloseIconSvg,
          name: "default"
        }
      },
      participants: [
        {
          id: "admin",
          name: "Admin",
          imageUrl: "https://image.flaticon.com/icons/svg/172/172163.svg"
        }
      ],
      titleImageUrl: "https://image.flaticon.com/icons/svg/172/172163.svg",
      messageList: [],
      newMessagesCount: 0,
      isChatOpen: false,
      showTypingIndicator: "",
      colors: {
        header: {
          bg: "#13619A",
          text: "#ffffff"
        },
        launcher: {
          bg: "#13619A"
        },
        messageList: {
          bg: "#ffffff"
        },
        sentMessage: {
          bg: "#13619A",
          text: "#ffffff"
        },
        receivedMessage: {
          bg: "#eaeaea",
          text: "#222222"
        },
        userInput: {
          bg: "#f4f7f9",
          text: "#565867"
        }
      },
      alwaysScrollToBottom: false,
      messageStyling: true
    };
  },
  methods: {
    getChats() {
      axios
        .get(`/messages/get/${this.getUserId()}`)
        .then(res => {
          let msg = [];
          res.data[0].map(m => {
            if (m.user_id === +this.getUserId()) {
              msg.push({ type: "text", author: `me`, data: { text: m.message } });
            } else {
              msg.push({ type: "text", author: m.sender, data: { text: m.message } });
            }
          });
          this.messageList = msg;
        })
        .catch(() => {});
    },
    sendMessage(text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1;
        this.onMessageWasSent({
          author: "support",
          type: "text",
          data: { text }
        });
      }
    },
    onMessageWasSent(message) {
      axios
        .post("/messages/send", { user_id: this.getUserId(), message: message.data.text })
        .then(() => {
          this.messageList = [...this.messageList, message];
        })
        .catch(() => {});
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    editMessage(message) {
      const m = this.messageList.find(m => m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  }
};
</script>

<style>
.sc-message--text-content {
  margin-bottom: 5px !important;
  margin-top: 5px !important;
}
.thumbnail-chat {
  height: 50px;
  width: 50px;
  padding: 0;
}
</style>
