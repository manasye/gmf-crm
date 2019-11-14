<template>
  <b-container fluid class="container-app">
    <Header :title="`Complaint ${$route.params.id}`" :breadcrumbs="breadcrumbs"></Header>
    <div class="detail-header">
      <b-row>
        <b-col
          cols="4"
          md="2"
          v-for="(value, key, i) in headers"
          class="mb-md-0"
          :class="{ 'mb-3': i === 1 }"
          :key="key"
        >
          <p class="mb-1">{{ convertSnakeCaseToText(key) }}</p>
          <p class="mb-0 font-weight-bold">{{ value || "-" }}</p>
        </b-col>
        <b-col cols="4" md="3" class="mb-md-0">
          <p class="mb-1">Status</p>
          <p class="mb-0" style="font-size: .6rem">
            <b-badge
              :variant="getVariantBadge(detail.status)"
              style="font-size: .75rem; text-transform: uppercase"
              >{{ detail.status }}</b-badge
            >&nbsp;
          </p>
        </b-col>
      </b-row>
    </div>
    <div class="detail-info">
      <div class="detail mt-3 mt-md-0">
        <h5 class="title">{{ detail.subject }}</h5>
        <p class="dept">Department &nbsp; &nbsp; {{ detail.service }}</p>
        <p>
          {{ detail.complaint }}
        </p>
      </div>
      <div class="file mt-4 mb-4">
        <p v-for="i in 1">
          <font-awesome-icon icon="link"></font-awesome-icon>
          <a href>
            Example.pdf
            <br />
          </a>
        </p>
      </div>
      <div class="comments mb-3 mb-md-0" v-for="r in replies" :key="r.reply_complaint_id">
        <h5>
          <b-badge pill variant="primary">{{ r.sender }}</b-badge>
        </h5>
        <p>
          {{ r.description }}
        </p>
      </div>
      <b-form-textarea
        v-if="showReplyTextArea"
        v-model="replyText"
        placeholder="Reply here..."
        rows="3"
        max-rows="6"
        class="mb-4"
      ></b-form-textarea>
      <b-button variant="success" @click="showReplyTextArea = true" v-if="!showReplyTextArea"
        >REPLY</b-button
      >
      <b-button variant="success" v-else @click="submitReply">SUBMIT</b-button>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    axios
      .get(`/complaint/edit/${this.$route.params.id}`)
      .then(res => {
        const data = res.data.data[0];
        this.headers.sender = data.sender;
        this.headers.complaint_submitted = data.date;
        this.headers.complaint_closed = data.closed;
        this.detail = data;
      })
      .catch(() => {});
    this.getReplies();
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Complaint List",
          href: "/#/feedback-customer"
        },
        {
          text: `Complaint ${this.$route.params.id}`,
          active: true
        }
      ],
      showReplyTextArea: false,
      replyText: null,
      detail: { status: "" },
      headers: {
        sender: "",
        complaint_submitted: "",
        complaint_closed: ""
      },
      replies: []
    };
  },
  methods: {
    getVariantBadge(status) {
      switch (status) {
        case "Closed":
          return "success";
        case "Open":
          return "danger";
        case "Receive":
          return "warning";
        default:
          return "primary";
      }
    },
    getReplies() {
      axios
        .get(`/complaint/readreply/${this.$route.params.id}`)
        .then(res => {
          this.replies = res.data.data;
        })
        .catch(() => {});
    },
    submitReply() {
      axios
        .post("/complaint/reply", {
          description: this.replyText,
          user_id: this.getUserId(),
          complaint_id: this.$route.params.id
        })
        .then(() => {
          this.getReplies();
          this.showReplyTextArea = false;
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
          this.showReplyTextArea = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-header {
  background-color: #13619a;
  color: white;
  padding: 10px 30px;
}
.detail-info {
  border: 1px solid #949699;
  border-top: transparent;
  padding: 30px 30px;
}
.detail {
  border-left: 5px solid #13619a;
  padding-left: 20px;
  .title {
    font-weight: bold;
    margin-bottom: 0.3rem;
  }
  .dept {
    color: #13619a;
    font-weight: bold;
  }
}
.file {
  background-color: #f2f2f2;
  padding: 5px 15px;
  p {
    margin-bottom: 0 !important;
  }
  a {
    margin-left: 10px;
    color: #022f46;
  }
}
@media (max-width: 700px) {
  .detail-header,
  .detail-info {
    padding: 10px;
  }
}
</style>
