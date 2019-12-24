<template>
  <div @click="chatClicked">
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
      timeInterval: 5000,
      chatInterval: null,
      imageInterval: null,
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
    chatClicked() {
      axios
        .get(`/messages/read/1/${this.getUserId()}`)
        .then(() => {})
        .catch(() => {});
    },
    getChats() {
      axios
        .get(`/messages/get/${this.getUserId()}`)
        .then(res => {
          let msg = [];
          res.data.message.map(m => {
            let author;
            if (m.user_id === +this.getUserId()) {
              author = "me";
            } else {
              author = m.sender;
            }

            let data;
            if (m.type === "text") {
              data = { text: m.message || "" };
            } else {
              data = {
                file: {
                  name: "File",
                  url: this.getBaseStorage() + m.message
                }
              };
            }

            msg.push({ type: m.type, author: author, data });
          });
          this.messageList = msg;
          this.newMessagesCount = res.data.unread_count;
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
      let data;

      if (message.type === "file") {
        let formData = new FormData();
        formData.set("user_id", this.getUserId());
        formData.set("file", message.data.file);
        formData.set("type", "file");

        data = formData;
      } else {
        data = {
          user_id: this.getUserId(),
          message: message.data.text,
          type: "text"
        };
      }

      axios
        .post("/messages/send", data)
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
.sc-message--file-name a {
  font-size: 14px !important;
}
.sc-message--file-name {
  margin-top: 7px;
}
.sc-message--file-text {
  padding: 5px 20px !important;
}
.sc-message--file-icon {
  display: none;
}
</style>
