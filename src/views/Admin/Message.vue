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
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRy1-J0LUzC2Q2BBwXM5xgqB1g3hoXzZfei4qqKRH-FcPw_GlcH"
                    alt=""
                  />
                </b-col>
                <b-col cols="8"><p class="mb-0 ml-3" style="margin-top: .7rem">Admin</p></b-col>
                <b-col cols="2" style="text-align: right; margin-bottom: 35px"
                  ><font-awesome-icon
                    icon="plus-circle"
                    style="margin-top: .7rem; font-size: 20px;cursor: pointer;"
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
                v-for="chat in chats"
                :key="chat.user_name"
                :class="{ 'chat-active': activeChat === chat.chat_id }"
                @click="activeChat = chat.chat_id"
              >
                <b-row no-gutters>
                  <b-col cols="2"> <img :src="chat.user_img" alt=""/></b-col>
                  <b-col cols="8"
                    ><p class="mb-0 ml-3">{{ chat.user_name }}</p>
                    <p class="mb-0 ml-3" style="color: #949699">{{ chat.company }}</p></b-col
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
          <b-row no-gutters style="margin: 10px 0">
            <b-col cols="12" class="pl-3 pr-3 mb-2">
              <b-row no-gutters>
                <b-col cols="1">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRy1-J0LUzC2Q2BBwXM5xgqB1g3hoXzZfei4qqKRH-FcPw_GlcH"
                    alt=""
                  />
                </b-col>
                <b-col cols="9"
                  ><p class="mt-1 mb-0 ml-3">Admin</p>
                  <p class="mb-0 ml-3" style="color: #949699">aa</p></b-col
                >
                <b-col cols="2" style="text-align: right; margin-top: 10px"
                  ><b-button variant="danger" size="sm">CLOSE THREAD</b-button></b-col
                >
              </b-row>
            </b-col>
            <b-col cols="12" class="chat-content p-3">
              <div class="in">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid, assumenda
                  at dolorem doloribus eaque earum expedita illo illum labore laboriosam molestiae
                  non nulla provident qui rem repellendus veniam voluptatum?
                </p>
              </div>
              <div style="text-align: right">
                <div class="out">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor eius, illum
                    iusto laudantium natus quasi. Aliquam animi aut, dolores, fuga incidunt optio
                    perferendis quia quisquam, reprehenderit similique ut voluptate voluptatem!
                  </p>
                </div>
              </div>
            </b-col>
            <b-col cols="10" class="pt-2 pl-3">
              <b-form-input placeholder="Write a message..." v-model="chat"></b-form-input>
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
              <img src="../../assets/img/send-button.png" alt="" class="send-button" />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import swal from "sweetalert";

const chat = {
  chat_id: 1,
  user_img:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRy1-J0LUzC2Q2BBwXM5xgqB1g3hoXzZfei4qqKRH-FcPw_GlcH",
  user_name: "Asa",
  company: "saaksj",
  time: "10.30pm",
  unread: "3"
};

export default {
  data() {
    return {
      chats: Array(3).fill(chat),
      activeChat: null,
      search: null,
      chat: null,
      files: []
    };
  },
  methods: {
    fileUpload() {
      document.getElementById("file").click();
    }
  }
};
</script>

<style scoped lang="scss">
.chat-container {
  border: 1px solid #949699;
}
img {
  border-radius: 50%;
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
  }
}
.send-button {
  width: 30px;
  margin-top: 5px;
  cursor: pointer;
}
</style>
