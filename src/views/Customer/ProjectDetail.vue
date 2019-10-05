<template>
  <div>
    <Header :title="$route.params.id" :breadcrumbs="breadcrumbs"></Header>
    div.
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Project List",
          href: "/#/project-customer"
        },
        {
          text: this.$route.params.id,
          active: true
        }
      ]
    };
  },
  components: {
    Header
  }
};
</script>

<style scoped></style>

<style>
.breadcrumb {
  background-color: transparent;
  padding: 0 0;
}
</style>
