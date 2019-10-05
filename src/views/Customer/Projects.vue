<template>
  <div>
    <Header title="PROJECT LIST"></Header>

    <b-row>
      <b-col cols="6" md="3">
        <b-form-select v-model="selectedStatus" :options="statusOptions"></b-form-select
      ></b-col>
      <b-col cols="6" md="3">
        <b-row>
          <b-col cols="0" md="8" class="d-none d-md-block">
            <p class="per-page-text">Number of items per page</p></b-col
          >
          <b-col cols="12" md="4"
            ><b-form-select
              v-model="perPage"
              :options="perPageOptions"
            ></b-form-select></b-col></b-row
      ></b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="projects"
      :fields="projectFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showProjectDetail"
    >
      <template v-slot:cell(status)="data">
        <b-badge v-if="data.value === 'Closed'" variant="danger"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
        <b-badge v-if="data.value === 'Open'" variant="success"
          ><p style="margin: 5px">{{ data.value }}</p></b-badge
        >
      </template>
      <template v-slot:cell(rating)="rate">
        <star-rating
          :rating="+rate.value"
          read-only
          :show-rating="false"
          :star-size="25"
          v-if="rate.value"
        ></star-rating>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import StarRating from "vue-star-rating";

export default {
  name: "ProjectCustomer",
  data() {
    return {
      statusOptions: [
        {
          value: null,
          text: "All Status"
        },
        {
          value: "a",
          text: "Closed"
        },
        {
          value: "a",
          text: "Open"
        }
      ],
      selectedStatus: null,
      perPageOptions: [
        {
          value: "10",
          text: "10"
        },
        {
          value: "20",
          text: "20"
        },
        {
          value: "50",
          text: "50"
        }
      ],
      perPage: "10",
      currentPage: 1,
      projectFields: [
        "project_id",
        "project_name",
        "start_date",
        "finish_date",
        "location",
        { key: "status", label: "Status" },
        { key: "rating", label: "Rating" }
      ],
      projects: [
        {
          project_id: "a",
          project_name: "b",
          start_date: "a",
          finish_date: "a",
          location: "a",
          status: "Open",
          rating: "2"
        }
      ]
    };
  },
  components: {
    Header,
    StarRating
  },
  computed: {
    rows() {
      return this.projects.length;
    }
  },
  methods: {
    showProjectDetail(row) {
      this.$store.dispatch("goToPage", `/project-customer/${row.project_id}`);
    }
  }
};
</script>

<style scoped>
@media (min-width: 701px) {
  .per-page-text {
    margin-top: 5px;
  }
}
</style>

<style>
.page-item.active .page-link {
  background-color: #7ebe42;
  border-color: #7ebe42;
}
</style>
