<template>
  <b-container fluid class="container-app">
    <Header :title="`Search Result - '${this.$route.params.query}'`" />

    <h5 v-if="customer.length > 0">Customer</h5>
    <b-table
      v-if="customer.length > 0"
      striped
      hover
      :fields="customerField"
      :items="customer"
      :current-page="currentPageCustomer"
      :per-page="5"
      responsive
      @row-clicked="showCustomer"
      show-empty
    >
      <template v-slot:cell(status)="data">
        <b-badge :variant="getBadgesVariant(data.value)" style="margin-right: 30px">
          <p class="status-badges" :class="getBadgesVariant(data.value)">{{ data.value }}</p>
        </b-badge>
      </template>

      <template v-slot:cell(edit)="data"
        ><font-awesome-icon
          v-if="getRole() === 'Admin'"
          icon="pen"
          style="cursor: pointer"
          class="mr-3"
          @click.stop="editStatus(data.item)"/></template
    ></b-table>
    <b-pagination
      v-model="currentPageCustomer"
      :total-rows="rowsCustomer"
      :per-page="5"
      class="justify-content-end"
      v-if="customer.length > 0"
    />

    <h5 v-if="project.length > 0">Project</h5>
    <b-table
      v-if="project.length > 0"
      striped
      hover
      :items="project"
      :fields="projectField"
      :current-page="currentPageProject"
      :per-page="5"
      responsive
      @row-clicked="showProject"
      show-empty
    />
    <b-pagination
      v-model="currentPageProject"
      :total-rows="rowsProject"
      :per-page="5"
      class="justify-content-end"
      v-if="project.length > 0"
    />

    <h5 v-if="name.length > 0">Name</h5>
    <b-table
      v-if="name.length > 0"
      striped
      hover
      :fields="nameField"
      :items="name"
      :current-page="currentPageName"
      :per-page="5"
      responsive
      @row-clicked="showName"
      show-empty
    >
      <template v-slot:cell(email)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >
    <b-pagination
      v-model="currentPageName"
      :total-rows="rowsName"
      :per-page="5"
      class="justify-content-end"
      v-if="name.length > 0"
    />

    <h5 v-if="username.length > 0">Username</h5>
    <b-table
      v-if="username.length > 0"
      striped
      hover
      :fields="usernameField"
      :items="username"
      :current-page="currentPageUsername"
      :per-page="5"
      responsive
      @row-clicked="showUsername"
      show-empty
    >
      <template v-slot:cell(email)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      >
    </b-table>
    <b-pagination
      v-model="currentPageUsername"
      :total-rows="rowsUsername"
      :per-page="5"
      class="justify-content-end"
      v-if="username.length > 0"
    />

    <h5 v-if="service.length > 0">Service</h5>
    <b-table
      v-if="service.length > 0"
      striped
      hover
      :fields="serviceField"
      :items="service"
      :current-page="currentPageService"
      :per-page="5"
      responsive
      @row-clicked="showService"
      show-empty
    >
      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >
    <b-pagination
      v-model="currentPageService"
      :total-rows="rowsService"
      :per-page="5"
      class="justify-content-end"
      v-if="service.length > 0"
    />

    <h5 v-if="complaint.length > 0">Complaint</h5>
    <b-table
      v-if="complaint.length > 0"
      striped
      hover
      :fields="complaintField"
      :items="complaint"
      :current-page="currentPageComplaint"
      :per-page="5"
      responsive
      @row-clicked="showComplaint"
      show-empty
    />
    <b-pagination
      v-model="currentPageComplaint"
      :total-rows="rowsComplaint"
      :per-page="5"
      class="justify-content-end"
      v-if="complaint.length > 0"
    />

    <h5 v-if="feedback.length > 0">Feedback</h5>
    <b-table
      v-if="feedback.length > 0"
      striped
      hover
      :fields="feedbackField"
      :items="feedback"
      :current-page="currentPageFeedback"
      :per-page="5"
      responsive
      @row-clicked="showFeedback"
      show-empty
    />
    <b-pagination
      v-model="currentPageFeedback"
      :total-rows="rowsFeedback"
      :per-page="5"
      class="justify-content-end"
      v-if="feedback.length > 0"
    />

    <h5 v-if="holiday.length > 0">Holiday Card</h5>
    <b-table
      v-if="holiday.length > 0"
      striped
      hover
      :fields="holidayField"
      :items="holiday"
      :current-page="currentPageHoliday"
      :per-page="5"
      responsive
      @row-clicked="showHoliday"
      show-empty
    >
      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >
    <b-pagination
      v-model="currentPageHoliday"
      :total-rows="rowsHoliday"
      :per-page="5"
      class="justify-content-end"
      v-if="holiday.length > 0"
    />

    <h5
      v-if="
        project.length === 0 &&
          name.length === 0 &&
          username.length === 0 &&
          service.length === 0 &&
          complaint.length === 0 &&
          feedback.length === 0 &&
          holiday.length === 0 &&
          customer.length === 0 &&
          !loading
      "
    >
      No Result Found
    </h5>

    <div class="loader" v-if="loading">Loading...</div>

    <b-modal
      v-model="showModalStatus"
      centered
      title="Edit Status"
      v-if="showModalStatus && customerSelected"
      @ok="changeStatus"
      ><b-row>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select
            v-model="customerSelected.status"
            :options="statusOptions"
          /> </b-col></b-row
    ></b-modal>
  </b-container>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    this.getSearch();
  },
  data() {
    return {
      project: [],
      name: [],
      username: [],
      service: [],
      complaint: [],
      feedback: [],
      holiday: [],
      customer: [],
      projectField: [
        { key: "name", label: "Project Name" },
        { key: "start", label: "Est Start Date" },
        { key: "finish", label: "Est Finish Date" },
        { key: "project_type" },
        { key: "status" },
        { key: "quantity", label: "Qty" },
        { key: "rating" }
      ],
      nameField: [
        { key: "user_customer_id", label: "Id" },
        "name",
        "position",
        "religion",
        "birthday",
        "email",
        "customer_role"
      ],
      usernameField: [
        "user_id",
        "username",
        "role",
        "status",
        "name",
        "position",
        "religion",
        "birthday",
        "email",
        "customer_role"
      ],
      serviceField: ["service_id", "name", "permalink"],
      complaintField: [
        "complaint_id",
        "date",
        "sender",
        "service",
        "subject",
        "complaint",
        "status"
      ],
      feedbackField: [
        { key: "feedback_nonproject_id", label: "Id" },
        "date",
        "rating",
        "subject",
        "sender"
      ],
      holidayField: [
        { key: "religion_card_id", label: "Id" },
        "subject",
        "religion",
        "date",
        "permalink"
      ],
      customerField: [
        { key: "name", label: "Company Name" },
        { key: "region" },
        { key: "country" },
        { key: "company_role" },
        { key: "business_model" },
        { key: "status", label: "Status" },
        "edit"
      ],
      customerSelected: null,
      showModalStatus: false,
      statusOptions: [
        {
          value: "Active",
          text: "Active"
        },
        {
          value: "Inactive",
          text: "Inactive"
        },
        {
          value: "Obsolete",
          text: "Obsolete"
        }
      ],
      currentPageCustomer: 1,
      currentPageProject: 1,
      currentPageName: 1,
      currentPageUsername: 1,
      currentPageService: 1,
      currentPageComplaint: 1,
      currentPageFeedback: 1,
      currentPageHoliday: 1,
      loading: false
    };
  },
  computed: {
    rowsCustomer() {
      return this.customer.length;
    },
    rowsProject() {
      return this.project.length;
    },
    rowsName() {
      return this.name.length;
    },
    rowsService() {
      return this.service.length;
    },
    rowsFeedback() {
      return this.feedback.length;
    },
    rowsHoliday() {
      return this.holiday.length;
    },
    rowsUsername() {
      return this.username.length;
    },
    rowsComplaint() {
      return this.complaint.length;
    }
  },
  methods: {
    getSearch() {
      this.loading = true;
      const url = this.isAdmin()
        ? `/searchadmin/${this.$route.params.query}`
        : `/search/${this.$route.params.query}/${this.getCompanyId()}`;

      axios
        .get(url)
        .then(res => {
          this.project = res.data.data.project || [];
          this.name = res.data.data.name || [];
          this.username = res.data.data.username || [];
          this.service = res.data.data.service || [];
          this.complaint = res.data.data.complaint || [];
          this.feedback = res.data.data.feedback_nonproject || [];
          this.holiday = res.data.data.holiday_card || [];
          this.customer = res.data.data.customer || [];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    showProject(row) {
      this.$store.dispatch("goToPage", `/project-customer/${row.project_id}`);
    },
    showName(row) {
      console.log(row);
    },
    showUsername(row) {
      console.log(row);
    },
    showService(row) {
      this.$store.dispatch("goToPage", "/services");
    },
    showComplaint(row) {
      const url = this.isAdmin()
        ? `/complaint/${row.complaint_id}`
        : `/feedback/${row.complaint_id}`;
      this.$store.dispatch("goToPage", url);
    },
    showFeedback(row) {
      this.$store.dispatch("goToPage", `/feedback-nonproject/${row.feedback_nonproject_id}`);
    },
    showHoliday(row) {
      this.$store.dispatch("goToPage", `/information-holiday-card/${row.religion_card_id}`);
    },
    showCustomer(row) {
      this.$store.dispatch("goToPage", `/customer/${row.company_id}/Overview`);
    },
    editStatus(item) {
      this.customerSelected = item;
      this.showModalStatus = true;
    },
    changeStatus() {
      let form = new FormData();
      form.set("id", this.customerSelected.company_id);
      form.set("status", this.customerSelected.status);
      axios
        .post("/company/update", form)
        .then(() => {})
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getBadgesVariant(val) {
      if (val === "Inactive") return "warning";
      else if (val === "Active") return "success";
      else return "secondary";
    }
  },
  watch: {
    $route(to, from) {
      this.getSearch();
    }
  }
};
</script>

<style lang="scss" scoped>
.status-badges {
  margin: 5px;
  text-transform: capitalize;
  color: white;
}
.loader,
.loader:before,
.loader:after {
  background: #000000;
  -webkit-animation: load1 1s infinite ease-in-out;
  animation: load1 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
}
.loader {
  color: #000000;
  text-indent: -9999em;
  margin: 88px auto;
  position: relative;
  font-size: 11px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  position: absolute;
  top: 0;
  content: "";
}
.loader:before {
  left: -1.5em;
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}
.loader:after {
  left: 1.5em;
}
@-webkit-keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
@keyframes load1 {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
}
</style>
