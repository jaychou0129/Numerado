<template>
  <v-container class="text-center fill-height flex-column">
    <v-row>
      <v-col v-if="!gameMode" cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col>
        <h1 v-if="!gameMode" class="display-2 font-weight-bold mb-3">
          Welcome to Numerado!
        </h1>

        <p v-if="!gameMode" class="subheading font-weight-regular mb-10">
          Begin by selecting a game mode.
        </p>

        <v-btn-toggle v-model="gameMode" divided variant="outlined" mandatory>
          <v-btn value="readAloud" append-icon="mdi-account-voice">
            Read Aloud
          </v-btn>
          <v-btn value="listening" append-icon="mdi-headphones">
            Listening Practice
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row v-if="gameMode === 'readAloud'"><ReadAloudPractice /></v-row>
    <v-row v-if="gameMode === 'listening'"><ListeningPractice /></v-row>
  </v-container>
</template>

<script>
import ReadAloudPractice from "./ReadAloudPractice.vue";
import ListeningPractice from "./ListeningPractice.vue";
import { gameSettings } from "@/scripts/gameSettings";
export default {
  name: "GamePage",
  components: {
    ReadAloudPractice,
    ListeningPractice,
  },
  data: () => ({
    gameMode: null,
    gameSettings,
  }),
};
</script>
