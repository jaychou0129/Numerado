<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" temporary location="right">
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
        title="John Leider"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Home"
          value="home"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-forum"
          title="About"
          value="about"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-btn
        style="position: fixed; top: 5px; right: 5px"
        @click.stop="drawer = !drawer"
        ><v-icon>mdi-cog</v-icon></v-btn
      >
      <GamePage />
    </v-main>
  </v-app>
</template>

<script>
import GamePage from "./components/GamePage.vue";

export default {
  name: "App",
  components: {
    GamePage,
  },

  data: () => ({
    drawer: undefined,
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
  user-select: none;
}
</style>
