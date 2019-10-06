<template>
  <div>
    <Header title="NEWSLETTER" :breadcrumbs="breadcrumbs"></Header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        {
          text: "Information List",
          href: "/#/information-customer"
        },
        {
          text: this.$route.params.id,
          active: true
        }
      ]
    };
  }
};
</script>

<style scoped></style>
