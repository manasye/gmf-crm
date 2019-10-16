<template>
  <div>
    <b-row v-for="(service, idx) in services" :key="service.title" no-gutters class="mb-md-4">
      <b-col cols="12" md="7" :order-md="idx % 2 === 0 ? '1':'2'">
        <b-carousel controls indicators background="#ababab">
          <b-carousel-slide v-for="img in service.thumbnail" :img-src="img" :key="img">
            <h1>{{service.title.split(" ").slice(0, -1).join(" ")}}</h1>
            <h2>{{service.title.split(" ")[service.title.split(" ").length - 1]}}</h2>
            <b-button variant="primary" class="mt-4">Explore</b-button>
          </b-carousel-slide>
        </b-carousel>
      </b-col>
      
      <b-col cols="12" md="5" :order-md="idx % 2 !== 0 ? '1':'2'">
        <div class="detail-service">
          <b-row class="mb-5">
            <b-col cols="6" v-for="image in service.images" :key="image">
              <img :src="image" alt />
            </b-col>
          </b-row>
          <hr />
          <p>{{service.detail}}</p>
          <hr />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      services: [
        {
          title: "Engineering Services",
          route: "",
          thumbnail: [
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg",
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg"
          ],
          images: [
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg",
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg"
          ],
          detail:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit quo, quia culpa minus, earum repellendus corrupti ratione quas aperiam at mollitia amet molestiae non porro perspiciatis eveniet optio assumenda consectetur."
        },
        {
          title: "Engineering Services",
          route: "",
          thumbnail: [
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg",
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg"
          ],
          images: [
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg",
            "https://www.urbansplash.co.uk/images/placeholder-16-9.jpg"
          ],
          detail:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit quo, quia culpa minus, earum repellendus corrupti ratione quas aperiam at mollitia amet molestiae non porro perspiciatis eveniet optio assumenda consectetur."
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.img-service {
  background-size: cover;
  color: white;
  padding: 50px;
  height: 100%;
}
.detail-service {
  padding: 50px 30px;
  p {
    color: #016299;
  }
}
hr {
  border-top: 1px dotted #016299;
}
</style>

<style>
.carousel-caption {
  top: 10%;
  bottom: 0;
  text-align: left;
}
</style>

