<template>
  <b-container fluid class="container-app">
    <Header :title="`Search Result - ${this.$route.params.query}`" />
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    axios.get();
  },
  data() {
    return {
      key: value
    };
  }
};
</script>

<style scoped></style>
