<template>
  <div>
    <Header title="INFORMATION LIST"></Header>

    <b-row>
      <b-col cols="6" md="2" class="mt-2"> <p>Number of items per page</p></b-col>
      <b-col cols="6" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
      </b-col>
    </b-row>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="infos"
      :fields="informationFields"
      :per-page="perPage"
      :current-page="currentPage"
      responsive
      @row-clicked="showInfoDetail"
    >
      <template v-slot:cell(new)="data">
        <div style="text-align: right">
          <span class="dot" v-if="data.value"></span>
        </div>
      </template>
    </b-table>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
  </div>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";

export default {
  data() {
    return {
      perPage: "10",
      perPageOptions,
      currentPage: 1,
      informationFields: [{ key: "new", label: "" }, "type", "subject", "time"],
      infos: [
        {
          id: "a",
          new: true,
          type: "GMF Product",
          subject: "Reset your account password",
          time: "13.52"
        }
      ]
    };
  },
  methods: {
    showInfoDetail(row) {
      this.$store.dispatch("goToPage", `/information-customer/${row.id}`);
    }
  },
  computed: {
    rows() {
      return this.infos.length;
    }
  }
};
</script>

<style scoped>
.dot {
  height: 10px;
  width: 10px;
  background-color: #7ebe42;
  border-radius: 50%;
  display: inline-block;
}
</style>
