<template>
  <b-row class="mt-4">
    <b-col cols="3" class="pl-4 pr-4">
      <img :src="getBaseStorage() + details.image" alt class="d-block mb-4" style="width: 70%" />
      <div v-for="(value, name) in details" :key="name" class="mb-2">
        <p style="color: #949699" v-if="name !== 'image'">{{ convertSnakeCaseToText(name) }}</p>
        <p v-if="name !== 'image'">{{ value || "-" }}</p>
      </div>
    </b-col>
    <b-col cols="9">
      <b-button
        variant="success"
        class="float-right"
        size="sm"
        v-if="isAdmin()"
        @click="newUser('Key Person')"
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
        show-empty
      >
        <template v-slot:cell(pass_raw)="data"
          >{{ displayPass(data.value, data.item.show_pass) }} &nbsp;
          <font-awesome-icon
            :icon="data.item.show_pass ? 'eye' : 'eye-slash'"
            style="cursor: pointer"
            @click="data.item.show_pass = !data.item.show_pass"
          />
        </template>
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editPerson(data.item)"/>
          <font-awesome-icon
            v-if="isAdmin()"
            icon="trash"
            style="cursor: pointer"
            class="ml-3"
            @click="removePerson(data.item)"
        /></template>
      </b-table>

      <b-button
        variant="success"
        class="float-right"
        size="sm"
        v-if="isAdmin()"
        @click="newUser('Tech')"
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
        show-empty
      >
        <template v-slot:cell(pass_raw)="data"
          >{{ displayPass(data.value, data.item.show_pass) }} &nbsp;
          <font-awesome-icon
            :icon="data.item.show_pass ? 'eye' : 'eye-slash'"
            style="cursor: pointer"
            @click="data.item.show_pass = !data.item.show_pass"
          />
        </template>
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editPerson(data.item)"/>
          <font-awesome-icon
            v-if="isAdmin()"
            icon="trash"
            style="cursor: pointer"
            class="ml-3"
            @click="removePerson(data.item)"
        /></template>
      </b-table>

      <b-button variant="success" class="float-right" size="sm" v-if="isAdmin()" @click="newCp"
        >ADD NEW GMF CP</b-button
      >
      <h5>GMF CONTACT PERSON</h5>
      <b-table
        style="margin-top: 20px;"
        striped
        hover
        responsive
        :items="cps"
        :fields="cpField"
        show-empty
      >
        <template v-slot:cell(edit)="data">
          <font-awesome-icon
            v-if="isAdmin()"
            icon="pen"
            style="cursor: pointer"
            @click="editCp(data.item)"/>
          <font-awesome-icon
            v-if="isAdmin()"
            icon="trash"
            style="cursor: pointer"
            class="ml-3"
            @click="removeCp(data.item)"
        /></template>
      </b-table>
    </b-col>

    <b-modal v-model="showModalUser" centered title="Manage Account" @ok="postUser">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Position</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.position" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Religion</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.religion" :options="religions" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Birthday</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.birthday" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Email</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.email" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Customer Role</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.customer_role" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Username</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.username" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Password</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.pass_raw" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Status</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-select v-model="editedData.status" :options="statusOptions"
        /></b-col>
      </b-row>
    </b-modal>

    <b-modal v-model="showModalCp" centered title="Manage CP" @ok="postCp">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Phone</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.phone" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Position</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.position" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Email</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedCp.email" />
        </b-col>
      </b-row>
    </b-modal>
  </b-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";
import { religions } from "@/utility/globalVar.js";

const initialUser = {
  name: "",
  position: "",
  religion: "",
  birthday: "",
  email: "",
  customer_role: "",
  username: "",
  pass_raw: "",
  role: "",
  status: "",
  image: ""
};

const initialCp = {
  gmf_cp_id: "",
  name: "",
  position: "",
  phone: "",
  email: "",
  cp_company_id: "",
  company_id: ""
};

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
      editedData: initialUser,
      editedCp: initialCp,
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
      newCpMode: false,
      religions
    };
  },
  methods: {
    displayPass(pass, showPass) {
      if (!showPass) {
        return "*".repeat(pass.length);
      }
      return pass;
    },
    newUser(role) {
      this.editedData = initialUser;
      this.editedData.customer_role = role;
      this.showModalUser = true;
      this.newUserMode = true;
    },
    newCp() {
      this.editedCp = initialCp;
      this.showModalCp = true;
      this.newCpMode = true;
    },
    editPerson(person) {
      this.editedData = person;
      this.showModalUser = true;
      this.newUserMode = false;
    },
    removePerson(person) {
      console.log(person);
    },
    editCp(cp) {
      this.editedCp = cp;
      this.showModalCp = true;
      this.newCpMode = false;
    },
    removeCp(cp) {
      console.log(cp);
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
      const data = {
        ...this.editedData,
        id: this.editedData.user_id,
        password: this.editedData.pass_raw,
        role: "Customer",
        company_id: this.$route.params.id
      };
      delete data.image;

      axios
        .post(url, data)
        .then(() => {
          this.editedData = initialUser;
          this.getUser();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    postCp() {
      const url = this.newCpMode ? "/cp/create" : "/cp/update";
      const data = {
        ...this.editedCp,
        id: this.editedCp.gmf_cp_id,
        company_id: this.$route.params.id
      };
      delete data.image;

      axios
        .post(url, data)
        .then(() => {
          this.editedCp = initialCp;
          this.getCp();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
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
