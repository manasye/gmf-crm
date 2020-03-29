<template>
  <div>
    <b-form-select
      v-model="selected"
      :options="options"
      style="width: 20%"
      @input="getFleet"
      class="mt-2 mr-4"
    />

    <b-button class="mt-2" variant="success" @click="showModalFleet = true"
      >Add Fleet Type</b-button
    >

    <b-row class="mt-4">
      <b-col cols="6">
        <h5>{{ selected }}</h5></b-col
      >
      <b-col cols="6" style="text-align: right">
        <b-button variant="success" size="sm" v-if="isAdmin()" @click="newFleet">ADD NEW</b-button>
      </b-col>

      <b-col cols="7">
        <b-table
          style="margin-top: 20px;"
          responsive
          :fields="itemField"
          :items="items"
          class="mb-5"
          show-empty
        >
          <template v-slot:cell(edit)="data">
            <font-awesome-icon
              v-if="getRole() === 'Admin'"
              icon="pen"
              style="cursor: pointer"
              class="mr-3"
              @click.stop="editFleet(data.item)"
            />
            <font-awesome-icon
              v-if="getRole() === 'Admin'"
              icon="trash"
              style="cursor: pointer"
              class="mr-3"
              @click.stop="removeFleet(data.item)"
            />
          </template>
          <template v-slot:cell(maint_provider)="data">
            {{ data.value === "null" ? "" : data.value }}
          </template></b-table
        ></b-col
      >

      <b-col cols="5" style="margin-top: 20px; padding-left: 50px">
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

    <b-modal v-model="showModal" centered title="Manage Fleet" v-if="showModal" @ok="postFleet">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Product</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.product" :options="options" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Type</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedData.type" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Quantity</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.quantity" type="number" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Maint Provider</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="editedData.maint_provider" /> </b-col
        ><b-col cols="4"> <label class="mt-2">Suitable</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.suitable" :options="suitableOptions" /> </b-col
      ></b-row>
    </b-modal>

    <b-modal
      v-model="showModalFleet"
      centered
      title="Add Alliance"
      v-if="showModalFleet"
      @ok="addFleetType"
    >
      <b-row>
        <b-col cols="4"> <label class="mt-2">Fleet Type</label></b-col>
        <b-col cols="8" class="mb-3"> <b-form-input v-model="fleetType" /> </b-col
        ><b-col cols="12">
          <p class="mb-0 p-link" @click="showModalFleetDelete = true">Remove Fleet Type</p>
        </b-col></b-row
      >
    </b-modal>

    <b-modal
      v-model="showModalFleetDelete"
      centered
      title="Remove Alliance"
      v-if="showModalFleetDelete"
    >
      <b-table striped hover :items="fleetTypeItems" :fields="fleetTypeFields" responsive show-empty
        ><template v-slot:cell(delete)="data">
          <font-awesome-icon
            v-if="getRole() === 'Admin'"
            icon="trash"
            style="cursor: pointer"
            @click.stop="removeFleetType(data.item)"
        /></template>
      </b-table>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    this.getFleet();
    this.getFleetType();
    if (!this.isAdmin()) this.itemField.pop();
  },
  data() {
    return {
      selected: "Airframe",
      options: [
        {
          value: "Airframe",
          text: "Airframe"
        },
        {
          value: "Engine",
          text: "Engine"
        },
        {
          value: "Apu",
          text: "Apu"
        },
        {
          value: "Component",
          text: "Component"
        }
      ],
      suitableOptions: [
        {
          value: "null",
          text: "None"
        },
        {
          value: "current",
          text: "Current"
        },
        {
          value: "future",
          text: "Future"
        }
      ],
      itemField: ["type", "quantity", "maint_provider", "edit"],
      items: [],
      showModal: false,
      editedData: {},
      showModalFleet: false,
      showModalFleetDelete: false,
      fleetType: "",
      fleetTypeFields: ["type", "delete"],
      fleetTypeItems: []
    };
  },
  methods: {
    getFleet() {
      axios
        .get(`/fleet/readcompanyproduct/${this.$route.params.id}/${this.selected}`)
        .then(res => {
          const data = res.data.data;
          let item = [];
          data.map(d => {
            if (d.suitable === "current") {
              item.push({ ...d, _rowVariant: "warning", edit: true });
            } else if (d.suitable === "future") {
              item.push({ ...d, _rowVariant: "primary", edit: true });
            } else {
              item.push({ ...d, edit: true });
            }
          });
          this.items = item;
        })
        .catch(() => {});
    },
    editFleet(fleet) {
      this.editedData = fleet;
      this.showModal = true;
    },
    newFleet() {
      this.editedData = {};
      this.showModal = true;
    },
    postFleet() {
      let url = this.editedData.fleet_maint_id ? "/fleet/update" : "/fleet/create";
      axios
        .post(url, { ...this.editedData, company_id: +this.$route.params.id })
        .then(() => {
          swal("Success", `Fleet successfully managed`, "success");
          this.getFleet();
        })
        .catch(() => {});
    },
    removeFleet(fleet) {
      axios
        .get("/fleet/delete/" + fleet.fleet_maint_id)
        .then(() => {
          this.getFleet();
        })
        .catch(() => {});
    },
    getFleetType() {
      axios
        .get("/aircraft_type/read")
        .then(res => {
          this.fleetTypeItems = res.data.data;
        })
        .catch(() => {});
    },
    addFleetType() {
      axios
        .post("/aircraft_type/create", { type: this.fleetType })
        .then(() => {
          this.getFleetType();
        })
        .catch(() => {});
    },
    removeFleetType(item) {
      axios
        .get(`/aircraft_type/delete/${item.id}`)
        .then(() => {
          this.getFleetType();
        })
        .catch(() => {});
    }
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
