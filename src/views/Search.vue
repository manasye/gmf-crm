<template>
  <b-container fluid class="container-app">
    <Header :title="`Search Result - '${this.$route.params.query}'`" />
    <h5 v-if="project.length > 0">Project</h5>
    <b-table
      v-if="project.length > 0"
      striped
      hover
      :items="project"
      :fields="projectField"
      responsive
      @row-clicked="showProject"
      show-empty
    />

    <h5 v-if="name.length > 0">Name</h5>
    <b-table
      v-if="name.length > 0"
      striped
      hover
      :fields="nameField"
      :items="name"
      responsive
      @row-clicked="showName"
      show-empty
    >
      <template v-slot:cell(email)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >

    <h5 v-if="username.length > 0">Username</h5>
    <b-table
      v-if="username.length > 0"
      striped
      hover
      :fields="usernameField"
      :items="username"
      responsive
      @row-clicked="showUsername"
      show-empty
    >
      <template v-slot:cell(email)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      >
    </b-table>

    <h5 v-if="service.length > 0">Service</h5>
    <b-table
      v-if="service.length > 0"
      striped
      hover
      :fields="serviceField"
      :items="service"
      responsive
      @row-clicked="showService"
      show-empty
    >
      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >

    <h5 v-if="complaint.length > 0">Complaint</h5>
    <b-table
      v-if="complaint.length > 0"
      striped
      hover
      :fields="complaintField"
      :items="complaint"
      responsive
      @row-clicked="showComplaint"
      show-empty
    />

    <h5 v-if="feedback.length > 0">Feedback Non Project</h5>
    <b-table
      v-if="feedback.length > 0"
      striped
      hover
      :fields="feedbackField"
      :items="feedback"
      responsive
      @row-clicked="showFeedback"
      show-empty
    />

    <h5 v-if="holiday.length > 0">Holiday Card</h5>
    <b-table
      v-if="holiday.length > 0"
      striped
      hover
      :fields="holidayField"
      :items="holiday"
      responsive
      @row-clicked="showHoliday"
      show-empty
    >
      <template v-slot:cell(permalink)="data"
        ><a :href="data.value">{{ data.value }}</a></template
      ></b-table
    >

    <h5 v-if="customer.length > 0">Customer</h5>
    <b-table
      v-if="customer.length > 0"
      striped
      hover
      :fields="customerField"
      :items="customer"
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

    <h5
      v-if="
        project.length === 0 &&
          name.length === 0 &&
          username.length === 0 &&
          service.length === 0 &&
          complaint.length === 0 &&
          feedback.length === 0 &&
          holiday.length === 0 &&
          customer.length === 0
      "
    >
      No Result Found
    </h5>

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
      ]
    };
  },
  methods: {
    getSearch() {
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
        })
        .catch(() => {});
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
      this.$store.dispatch(
        "goToPage",
        `/feedback-customer-nonproject/${row.feedback_nonproject_id}`
      );
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
</style>
