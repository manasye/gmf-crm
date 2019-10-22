<template>
  <div>
    <h5>Active Ads</h5>
    <b-table style="margin-top: 20px;" striped hover :items="activeAds" responsive class="mb-5">
      <template v-slot:cell(image)="data">
        <img :src="data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(action)="data">
        <b-button size="sm" variant="success">Remove from active ads</b-button>
      </template>
    </b-table>

    <b-button variant="success" size="sm" class="float-right">Create New Ad</b-button>
    <h5>Ads List</h5>

    <b-table style="margin-top: 20px;" striped hover :items="adList" responsive>
      <template v-slot:cell(image)="data">
        <img :src="data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(action)="data">
        <b-button size="sm" variant="success">Add to active ads</b-button> &nbsp;&nbsp;
        <font-awesome-icon
          style="cursor: pointer;"
          icon="pen"
          @click="editAd(data.item)"
        ></font-awesome-icon>
        &nbsp;&nbsp;
        <font-awesome-icon
          style="cursor: pointer;"
          icon="trash"
          @click="removeAd(data.item)"
        ></font-awesome-icon>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeAds: [
        {
          subject: "lorem ",
          image:
            "https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png",
          permalink:
            "https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png",
          action: "a"
        }
      ],
      adList: [
        {
          ad_name: "a",
          image:
            "https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png",
          permalink:
            "https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png",
          action: "a"
        }
      ]
    };
  },
  methods: {
    editAd(item) {},
    removeAd(item) {}
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
img {
  max-width: 120px;
}
</style>
