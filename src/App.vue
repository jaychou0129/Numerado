<template>
  <v-app>
    <v-main>
      <WelcomePage />
    </v-main>
  </v-app>
</template>

<script>
import WelcomePage from "./components/WelcomePage.vue";

export default {
  name: "App",
  components: {
    WelcomePage,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
