<template>
  <b-container fluid class="container-app">
    <Header :title="`Complaint ${$route.params.id}`" :breadcrumbs="breadcrumbs"></Header>
    <div class="detail-header">
      <b-row>
        <b-col
          cols="4"
          md="2"
          v-for="(h, i) in headers"
          class="mb-md-0"
          :class="{ 'mb-3': i === 1 }"
          :key="i"
        >
          <p class="mb-1">{{ h.key }}</p>
          <p class="mb-0 font-weight-bold">{{ h.value }}</p>
        </b-col>
        <b-col cols="4" md="3" class="mb-md-0">
          <p class="mb-1">Status</p>
          <p class="mb-0" style="font-size: .6rem">
            <b-badge :variant="getVariantBadge('open')" style="font-size: .75rem">OPEN</b-badge
            >&nbsp;&nbsp;*click to change status
          </p>
        </b-col>
      </b-row>
    </div>
    <div class="detail-info">
      <div class="detail mt-3 mt-md-0">
        <h5 class="title">JUDUL</h5>
        <p class="dept">Department &nbsp; &nbsp; Base Maintenance</p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis adipisci suscipit
          sapiente quas ipsam nulla exercitationem necessitatibus. Tenetur totam nisi porro saepe
          modi ullam ex quibusdam error! Est, laboriosam nemo.
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
      <div class="comments mb-3 mb-md-0">
        <h5>
          <b-badge pill variant="primary">Admin</b-badge>
        </h5>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eos, optio consectetur? Iure
          odit soluta tenetur velit itaque quam, nesciunt ipsa quod nisi in quas dolor laborum
          blanditiis error eaque aut.
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
      <b-button variant="success" @click="showReplyTextArea = !showReplyTextArea">REPLY</b-button>
    </div>
  </b-container>
</template>

<script>
export default {
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
      headers: [
        {
          key: "Sender",
          value: "John Henderson"
        },
        {
          key: "Sender",
          value: "John Henderson"
        },
        {
          key: "Sender",
          value: "John Henderson"
        },
        {
          key: "Sender",
          value: "John Henderson"
        }
      ]
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
