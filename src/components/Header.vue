<template>
  <div style="margin-bottom: 10px">
    <b-row no-gutters>
      <b-col cols="12" md="8" order="2" order-md="1">
        <b-breadcrumb :items="breadcrumbs" v-if="breadcrumbs.length > 0"></b-breadcrumb>
        <h2>{{ title }}</h2>
        <p class="mb-2">{{ subtitle }}</p>
      </b-col>
      <b-col cols="12" md="4" order="1" order-md="2" v-if="getRole() === 'Customer'">
        <div class="support">
          <p>SUPPORT</p>
          <img src="../assets/img/call.png" alt /> +62 21 550 8609, M-F 8 AM - 4 PM WIB
          <br />
          <img src="../assets/img/mail.png" alt /> marketing@gmf-aeroasia.co.id
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {},
    breadcrumbs: {
      default: () => []
    },
    subtitle: {
      default: () => ""
    }
  }
};
</script>

<style scoped lang="scss">
.support {
  background-color: #13619a;
  color: white;
  padding: 5px 15px;
  float: right;
  font-size: 12px;

  p {
    margin-bottom: 0;
    font-size: 14px;
  }

  img {
    width: 16px;
    margin-right: 6px;
  }
}
@media (max-width: 700px) {
  .support {
    margin-bottom: 20px;
    p {
      margin-bottom: 0 !important;
    }
  }
}
</style>

<style>
.breadcrumb {
  background-color: transparent !important;
  padding: 0 0 !important;
}
</style>
