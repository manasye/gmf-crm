<template>
  <b-row class="row-login">
    <b-col cols="12" md="8" class="left">
      <img src="../assets/img/logo-white.png" alt class="d-none d-md-block" />
      <b-row align-v="center" class="desc">
        <div>
          <h3>Welcome to</h3>
          <h1>CRM Digital Marketing.</h1>
          <h5 class="text-italic">Login to get going</h5>
          <hr align="left" />
          <h5>Development Environment</h5>
          <p class="text-italic">
            Please contact
            <a href="mailto: marketing@gmf-aeroasia.co.id" style="color: white"
              >marketing@gmf-aeroasia.co.id</a
            >
            to access the site
          </p>
        </div>
      </b-row>
    </b-col>
    <b-col cols="12" md="4">
      <b-row align-v="center" class="row-login" @keyup.enter="login">
        <div class="r-container">
          <label for="username">Username</label>
          <b-form-input id="username" v-model="username" @keyup.enter="login" />
          <label for="password" class="mt-4">Password</label>
          <b-form-input
            id="password"
            type="password"
            class="mb-4"
            v-model="password"
            @keyup.enter="login"
          />

          <b-row>
            <b-col cols="12">
              <b-form-checkbox v-model="remember" class="mb-4 mb-md-3">Remember Me</b-form-checkbox>
            </b-col>
            <!--                      <b-col cols="6" style="text-align: right">-->
            <!--                        <p @click="console.log('hi')">Forgot Password ?</p>-->
            <!--                      </b-col>-->
          </b-row>

          <b-button variant="primary" size="lg" style="width: 100%" @click="login" class="mt-3"
            >LOGIN</b-button
          >

          <img src="../assets/img/logo.png" alt class="d-block d-md-none mt-4" />
        </div>
      </b-row>
    </b-col>
  </b-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  mounted() {
    axios
      .get("/login")
      .then(res => {
        if (res.data.auth) {
          const route = this.getRole() === "Customer" ? "/project-customer" : "/customer";
          this.$store.dispatch("goToPage", route);
        }
      })
      .catch(() => {});
  },

  data() {
    return {
      remember: false,
      username: null,
      password: null
    };
  },
  methods: {
    login() {
      const dataLogin = {
        username: this.username,
        password: this.password,
        remember_me: this.remember ? 1 : 0
      };

      axios
        .post("/auth", dataLogin)
        .then(res => {
          const role = res.data.data_user.role;
          localStorage.setItem("role", role);
          localStorage.setItem("username", res.data.data_user.username);
          localStorage.setItem("company_id", res.data.detail_user.company_id);
          localStorage.setItem("user_id", res.data.detail_user.user_id);
          localStorage.setItem("user_customer_id", res.data.detail_user.user_customer_id);
          localStorage.setItem("user_image", res.data.data_user.image);
          const route = role === "Customer" ? "/project-customer" : "/customer";
          this.$store.dispatch("goToPage", route);
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    }
  }
};
</script>

<style scoped lang="scss">
.row-login {
  min-height: 100vh;
}
.left,
.right {
  padding: 10px 30px;
}
.left {
  background: url("../assets/img/login-bg.png");
  background-size: 100% 100%;
  color: white;
  img {
    width: 300px;
  }
  .desc {
    min-height: calc(100vh - 73.5px * 2);
    padding: 0 40px;
  }
}
.text-italic {
  font-style: italic;
}
hr {
  width: 20%;
  border-top: 10px solid white;
  margin: 40px 0;
}
.r-container {
  padding: 0 70px;
  width: 100%;
}
input {
  border: transparent !important;
  border-bottom: 1px solid #ced4da !important;
  border-radius: 0 !important;
}
@media (max-width: 700px) {
  .row-login {
    min-height: auto;
    margin-bottom: 15px;
  }
  .left {
    margin-bottom: 20px;
    background: url("../assets/img/login-bg-mobile.jpg");
    background-size: cover;

    .desc {
      min-height: 60vh;
    }
  }
  .r-container {
    padding: 0 50px;
  }
}
</style>
