<template>
  <div>
    <b-form-select v-model="selected" :options="options" style="width: 20%"></b-form-select>

    <b-row class="mt-4">
      <b-col cols="6">
        <h5>{{ selected }}</h5></b-col
      >
      <b-col cols="6" style="text-align: right">
        <b-button variant="success" size="sm" v-if="isAdmin()">EDIT</b-button>
      </b-col>
      <b-col cols="6">
        <b-table
          style="margin-top: 20px;"
          responsive
          :fields="itemField"
          :items="items"
          class="mb-5"
          show-empty
        ></b-table
      ></b-col>
      <b-col cols="6" style="margin-top: 20px; padding-left: 50px">
        <div class="mb-2">
          <b-badge style="background-color: #7abaff">&nbsp;&nbsp;&nbsp;</b-badge> &nbsp;
          &nbsp;Suitable with future capability
        </div>
        <div>
          <b-badge style="background-color: #ffdf7e">&nbsp;&nbsp;&nbsp;</b-badge> &nbsp;
          &nbsp;Suitable with current capability
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "airframe",
      options: [
        {
          value: "airframe",
          text: "Airframe"
        },
        {
          value: "engine",
          text: "Engine"
        },
        {
          value: "apu",
          text: "Apu"
        },
        {
          value: "component",
          text: "Component"
        }
      ],
      itemField: ["type", "quantity", "maint_provider"],
      items: [
        {
          type: "a",
          quantity: "a",
          maint_provider: "a",
          _rowVariant: "primary"
        },
        {
          type: "a",
          quantity: "a",
          maint_provider: "a"
        },
        {
          type: "a",
          quantity: "a",
          maint_provider: "a",
          _rowVariant: "warning"
        }
      ]
    };
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
.future {
  color: #00a65a;
}
.current {
  color: #ffa812;
}
</style>
