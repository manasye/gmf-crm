<template>
  <b-row class="mt-4">
    <b-col cols="3" class="pl-4 pr-4">
      <img
        src="data:image/png;base64,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"
        alt
        class="d-block mb-4"
        style="width: 70%"
      />
      <div v-for="(value, name) in details" :key="name" class="mb-2">
        <p style="color: #949699">{{ convertSnakeCaseToText(name) }}</p>
        <p>{{ value || "-" }}</p>
      </div>
    </b-col>
    <b-col cols="9">
      <b-button
        variant="success"
        class="float-right"
        size="sm"
        v-if="isAdmin()"
        @click="
          () => {
            showModalUser = true;
            editedData.customer_role = 'Key Person';
            newUserMode = true;
          }
        "
        >ADD NEW ACCOUNT</b-button
      >
      <h5>KEY PERSON</h5>
      <b-table
        style="margin-top: 20px;"
        striped
        hover
        responsive
        :items="persons"
        :fields="personField"
        class="mb-5"
      >
        <template v-slot:cell(pass_raw)="data"
          >{{ displayPass(data.value, data.item.show_pass) }} &nbsp;
          <font-awesome-icon
            :icon="data.item.show_pass ? 'eye' : 'eye-slash'"
            style="cursor: pointer"
            @click="data.item.show_pass = !data.item.show_pass"
          ></font-awesome-icon>
        </template>
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editPerson(data.item)"
          ></font-awesome-icon
        ></template>
      </b-table>

      <b-button
        variant="success"
        class="float-right"
        size="sm"
        v-if="isAdmin()"
        @click="
          () => {
            showModalUser = true;
            editedData.customer_role = 'Technical Representative';
            newUserMode = true;
          }
        "
        >ADD NEW ACCOUNT</b-button
      >
      <h5>TECHNICAL REPRESENTATIVE</h5>
      <b-table
        style="margin-top: 20px;"
        striped
        hover
        responsive
        :items="techs"
        :fields="personField"
        class="mb-5"
      >
        <template v-slot:cell(pass_raw)="data"
          >{{ displayPass(data.value, data.item.show_pass) }} &nbsp;
          <font-awesome-icon
            :icon="data.item.show_pass ? 'eye' : 'eye-slash'"
            style="cursor: pointer"
            @click="data.item.show_pass = !data.item.show_pass"
          ></font-awesome-icon>
        </template>
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editPerson(data.item)"
          ></font-awesome-icon
        ></template>
      </b-table>

      <b-button
        variant="success"
        class="float-right"
        size="sm"
        v-if="isAdmin()"
        @click="
          () => {
            showModalCp = true;
            editedData.customer_role = 'GMF Contact Person';
            newCpMode = true;
          }
        "
        >ADD NEW GMF CP</b-button
      >
      <h5>GMF CONTACT PERSON</h5>
      <b-table style="margin-top: 20px;" striped hover responsive :items="cps" :fields="cpField">
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editCp(data.item)"
          ></font-awesome-icon
        ></template>
      </b-table>
    </b-col>

    <b-modal v-model="showModalUser" centered title="Manage Account" @ok="postUser">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Position</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.position"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Religion</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.religion"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Birthday</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.birthday"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Email</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.email"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Role</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_role"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Username</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.username"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Password</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.pass_raw"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.status" :options="statusOptions"></b-form-select
        ></b-col>
      </b-row>
    </b-modal>

    <b-modal v-model="showModalCp" centered title="Manage CP" @ok="postCp">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Phone</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.phone"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Position</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.position"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Email</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.email"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </b-row>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      axios
        .get("/company/edit/" + this.$route.params.id)
        .then(res => {
          this.details = res.data.data[0];
        })
        .catch(() => {});

      this.getUser();
      this.getCp();
    }
  },
  data() {
    return {
      details: { company: "Garuda" },
      personField: [
        "name",
        "position",
        "religion",
        "birthday",
        "email",
        "username",
        { key: "pass_raw", label: "Password" },
        { key: "Edit", label: "" }
      ],
      persons: [],
      techs: [],
      cpField: ["name", "position", "phone", "email", { key: "Edit", label: "" }],
      cps: [],
      editedData: {
        name: "",
        position: "",
        religion: "",
        birthday: "",
        email: "",
        customer_role: "",
        username: "",
        pass_raw: "",
        role: "",
        status: ""
      },
      editedCp: {
        gmf_cp_id: 8,
        name: "Dewi",
        position: "Staff Marketing",
        phone: "081273829182",
        email: "deni@gmail.com",
        cp_company_id: 3,
        company_id: 1
      },
      showModalUser: false,
      statusOptions: [
        {
          value: null,
          text: "Select status"
        },
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
      showModalCp: false,
      newUserMode: false,
      newCpMode: false
    };
  },
  methods: {
    displayPass(pass, showPass) {
      if (!showPass) {
        return "*".repeat(pass.length);
      }
      return pass;
    },
    editPerson(person) {
      this.editedData = person;
      this.showModalUser = true;
      this.newUserMode = false;
    },
    editCp(cp) {
      this.editedCp = cp;
      this.showModalCp = true;
      this.newCpMode = false;
    },
    getUser() {
      axios
        .get(`/company/read/${this.$route.params.id}`)
        .then(res => {
          const users = res.data.data;
          this.persons = users
            .filter(u => u.customer_role === "Key Person")
            .map(el => {
              let o = Object.assign({}, el);
              o.show_pass = false;
              o.edit = "";
              return o;
            });
          this.techs = users
            .filter(u => u.customer_role === "Tech")
            .map(el => {
              let o = Object.assign({}, el);
              o.show_pass = false;
              o.edit = "";
              return o;
            });
        })
        .catch(() => {});
    },
    getCp() {
      axios
        .get(`/cp/read/${this.$route.params.id}`)
        .then(res => {
          this.cps = res.data.data.map(el => {
            let o = Object.assign({}, el);
            o.show_pass = false;
            o.edit = "";
            return o;
          });
        })
        .catch(() => {});
    },
    postUser() {
      const url = this.newUserMode ? "/user/create" : "/user/update";
      axios
        .post(url, {
          ...this.editedData,
          id: this.editedData.user_id,
          password: this.editedData.pass_raw
        })
        .then(res => {
          this.getUser();
        })
        .catch(() => {});
    },
    postCp() {
      const url = this.newCpMode ? "/cp/create" : "/cp/update";
      axios
        .post(url, { ...this.editedCp, id: this.editedCp.gmf_cp_id })
        .then(res => {
          this.getCp();
        })
        .catch(() => {});
    }
  },
  props: ["id"]
};
</script>

<style scoped>
p {
  margin-bottom: 0;
}
h5 {
  font-weight: bold;
}
</style>
