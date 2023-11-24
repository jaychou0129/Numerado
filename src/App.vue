<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      width="400"
      class="py-5 px-3"
    >
      <h3 align="left" class="mb-3">Settings</h3>
      <h5 align="left" class="mb-2">General</h5>
      <v-select
        label="Display Language"
        :items="SUPPORTED_DISPLAY_LANGUAGES"
        v-model="gameSettings.displayLanguage"
        item-title="title"
        item-value="value"
      ></v-select>
      <v-text-field
        label="Minimum value for generator"
        v-model.number="gameSettings.numberGeneratorMin"
        type="number"
        :rules="[
          (value) =>
            typeof value === 'number' &&
            gameSettings.numberGeneratorMax >= value,
        ]"
      ></v-text-field>
      <v-text-field
        label="Maximum value for generator"
        v-model.number="gameSettings.numberGeneratorMax"
        type="number"
        :rules="[
          (value) =>
            typeof value === 'number' &&
            value >= gameSettings.numberGeneratorMin,
        ]"
      ></v-text-field>

      <h5 align="left" class="mt-4 mb-2">Voice</h5>
      <v-select
        label="Voice Language"
        v-model="gameSettings.voice.language"
        :items="SUPPORTED_VOICE_LANGUAGES"
        item-title="title"
        item-value="value"
      ></v-select>
      <v-slider
        label="Velocity"
        v-model.number="gameSettings.voice.rate"
        prepend-icon="mdi-speedometer"
        min="0"
        max="2"
        step="0.1"
        thumb-label
      ></v-slider>
      <v-slider
        label="Pitch"
        v-model.number="gameSettings.voice.pitch"
        prepend-icon="mdi-equalizer"
        min="0"
        max="2"
        step="0.1"
        thumb-label
      ></v-slider>
    </v-navigation-drawer>
    <v-main>
      <v-btn
        variant="outlined"
        color="grey"
        icon="mdi-cog"
        style="position: fixed; top: 16px; right: 16px; border-radius: 4px"
        @click.stop="drawer = !drawer"
      />
      <GamePage />
    </v-main>
  </v-app>
</template>

<script>
import GamePage from "./components/GamePage.vue";
import {
  gameSettings,
  SUPPORTED_VOICE_LANGUAGES,
  SUPPORTED_DISPLAY_LANGUAGES,
} from "@/scripts/gameSettings";

export default {
  name: "App",
  components: {
    GamePage,
  },

  data: () => ({
    drawer: undefined,
    gameSettings,
  }),
  created() {
    this.SUPPORTED_VOICE_LANGUAGES = SUPPORTED_VOICE_LANGUAGES;
    this.SUPPORTED_DISPLAY_LANGUAGES = SUPPORTED_DISPLAY_LANGUAGES;
  },
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
