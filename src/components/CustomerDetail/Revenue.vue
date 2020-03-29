<template>
  <b-row class="mt-4">
    <b-col cols="5">
      <b-button variant="success" size="sm" class="float-right" v-if="isAdmin()" @click="newRev"
        >NEW</b-button
      >
      <h5 class="mb-4">Revenue Highlight</h5>
      <b-row align-v="end">
        <b-col cols="5" class="mt-2">
          <p class="mb-2">Start Date</p>
          <datepicker v-model="startDate" />
        </b-col>
        <b-col cols="5" class="mt-2">
          <p class="mb-2">End Date</p>
          <datepicker v-model="endDate"
        /></b-col>
        <b-col cols="2" class="mt-2">
          <b-button size="sm" variant="primary" @click="getRevs" :disabled="!startDate || !endDate"
            >Filter</b-button
          >
        </b-col>
      </b-row>

      <b-table
        class="mt-4"
        striped
        hover
        :fields="revenueFields"
        :items="revenues"
        show-empty
        responsive
      >
        <template v-slot:cell(sales)="data">
          {{ Math.abs(data.value) }}
        </template>
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="pen"
            style="cursor: pointer"
            class="mr-3"
            @click.stop="editRev(data.item)"/>
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="trash"
            style="cursor: pointer"
            class="mr-3"
            @click.stop="delRev(data.item)"/></template
      ></b-table>
    </b-col>

    <b-col cols="7">
      <b-button
        variant="success"
        size="sm"
        class="float-right"
        v-if="isAdmin()"
        @click="newActivity"
        >NEW</b-button
      >
      <h5>Past Marketing Activities</h5>
      <b-table
        class="mt-4"
        striped
        hover
        :fields="activityFields"
        :items="activites"
        show-empty
        responsive
      >
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="pen"
            style="cursor: pointer"
            class="mr-3"
            @click.stop="editActivity(data.item)"/>
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="trash"
            style="cursor: pointer"
            class="mr-3"
            @click.stop="delAct(data.item)"
        /></template> </b-table
    ></b-col>

    <b-modal
      v-model="showModalRev"
      centered
      title="Manage Revenue"
      v-if="showModalRev"
      @ok="postRev"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Product</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedRev.product" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Sales</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedRev.sales" type="number"/></b-col
        ><b-col cols="4"> <label class="mt-2">Date</label></b-col>
        <b-col cols="8" class="mb-3"><datepicker v-model="editedAct.datetime" /> </b-col
      ></b-row>
    </b-modal>

    <b-modal
      v-model="showModalAct"
      centered
      title="Manage Past Marketing Activites"
      v-if="showModalAct"
      @ok="postAct"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Activity</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedAct.activity" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Date</label></b-col>
        <b-col cols="8" class="mb-3"> <datepicker v-model="editedAct.date" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Remarks</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedAct.remarks" /> </b-col
      ></b-row>
    </b-modal>
  </b-row>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";

const initialAct = {
  date: "",
  activity: "",
  remarks: ""
};

const initialRev = {
  product: "",
  sales: ""
};

export default {
  mounted() {
    this.getActs();
    this.getRevs();
  },
  data() {
    return {
      startDate: null,
      endDate: null,
      revenueFields: ["product", "sales", "currency"],
      revenues: [],
      activites: [],
      activityFields: ["date", "activity", "remarks", "edit"],
      showModalAct: false,
      showModalRev: false,
      editedAct: initialAct,
      editedRev: initialRev
    };
  },
  methods: {
    newRev() {
      this.editedRev = initialRev;
      this.showModalRev = true;
    },
    editRev(rev) {
      this.editedRev = rev;
      this.showModalRev = true;
    },
    postRev() {
      this.editedRev.id = this.editedRev.revenue_id;
      this.editedRev.company_id = this.$route.params.id;
      this.editedRev.datetime = moment(this.editedRev.datetime).format("YYYY-MM-DD");

      const url = this.editedRev.revenue_id ? "/revenue/update" : "/revenue/create";
      axios
        .post(url, this.editedRev)
        .then(() => {
          this.getRevs();
          this.editedRev = initialRev;
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    delRev(rev) {
      axios
        .get(`/revenue/delete/${rev.revenue_id}`)
        .then(() => this.getRevs())
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    newActivity() {
      this.editedAct = initialAct;
      this.showModalAct = true;
    },
    editActivity(activity) {
      this.editedAct = activity;
      this.showModalAct = true;
    },
    postAct() {
      this.editedAct.date = moment(this.editedAct.date).format("YYYY-MM-DD");
      this.editedAct.id = this.editedAct.past_marketing_id;
      this.editedAct.company_id = this.$route.params.id;

      const url = this.editedAct.past_marketing_id
        ? "/pastmarketing/update"
        : "/pastmarketing/create";

      axios
        .post(url, this.editedAct)
        .then(() => {
          this.getActs();
          this.editedAct = initialAct;
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    delAct(activity) {
      axios
        .get(`/pastmarketing/delete/${activity.past_marketing_id}`)
        .then(() => this.getActs())
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getActs() {
      axios
        .get(`/pastmarketing/read/${this.$route.params.id}`)
        .then(res => {
          this.activites = res.data.data;
        })
        .catch(() => {});
    },
    getRevs() {
      let params = "";
      if (this.startDate) params += `start_date=${moment(this.startDate).format("YYYY-MM-DD")}`;
      if (this.endDate) params += `&end_date=${moment(this.endDate).format("YYYY-MM-DD")}`;
      axios
        .get(`/revenue/read/${this.$route.params.id}?${params}`)
        .then(res => {
          this.revenues = res.data.data;
        })
        .catch(() => {});
    }
  },
  components: {
    Datepicker
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
</style>
