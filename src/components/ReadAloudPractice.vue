<template>
  <v-container class="fill-height flex-column">
    <v-row>
      <p v-if="timer !== undefined">
        {{ parseFloat(timer).toFixed(1) }}
      </p>
    </v-row>
    <v-row>
      <h1
        v-if="gameState === 2"
        class="display-1"
        style="cursor: pointer"
        @click="playGeneratedNumberAudio"
      >
        <v-tooltip activator="parent" location="top"
          ><p>Click to hear the number pronounced.</p>
          <p align="center">
            ( <v-icon>mdi-keyboard</v-icon>

            <KeyboardKey>R</KeyboardKey>
            )
          </p></v-tooltip
        >
        <span> {{ localizedNumber }}</span>
      </h1>
      <h1 v-else class="display-1">
        {{ localizedNumber }}
      </h1>
    </v-row>
    <v-row>
      <div v-if="gameState === 0">
        <h3>Welcome to Read Aloud Practice</h3>
        <p>
          Press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          to start.
        </p>
      </div>
      <div v-if="gameState === 1">
        <p>
          Read the number aloud and press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          once you are done.
        </p>
      </div>
      <div v-if="gameState === 2">
        <p>
          Press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          to continue.
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import "talkify-tts";

import { gameSettings } from "@/scripts/gameSettings";
import { getRandomNumber } from "@/scripts/utils";
import KeyboardKey from "./KeyboardKey.vue";

const GameState = {
  INITIAL: 0,
  TIMER_STARTED: 1,
  TIMER_STOPPED: 2,
};

export default {
  name: "ReadAloudPractice",
  components: {
    KeyboardKey,
  },
  data: () => ({
    gameState: GameState.INITIAL,
    generatedNumber: undefined,
    timer: undefined,
    gameSettings,
  }),
  computed: {
    localizedNumber() {
      if (this.generatedNumber === undefined) return undefined;
      return this.generatedNumber.toLocaleString(
        this.gameSettings.voice.language
      );
    },
  },
  watch: {
    timer: {
      handler(value) {
        if (value === undefined) return;
        if (this.gameState != GameState.TIMER_STARTED) return;
        setTimeout(() => {
          this.timer += 0.1;
        }, 100);
      },
    },
    "gameSettings.voice": {
      handler() {
        // regenerate voice player
        this.generateVoicePlayer();
      },
      deep: true,
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
    this.generateVoicePlayer();
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    handleKeydown(event) {
      switch (event.key) {
        case "R":
        case "r":
          if (this.gameState === GameState.TIMER_STOPPED)
            this.playGeneratedNumberAudio();
          return;
        case " ":
          if (
            this.gameState === GameState.INITIAL ||
            this.gameState === GameState.TIMER_STOPPED
          ) {
            // Generate new number & start the timer
            this.generatedNumber = getRandomNumber(
              gameSettings.numberGeneratorMin,
              gameSettings.numberGeneratorMax
            );

            this.gameState = GameState.TIMER_STARTED;
            this.timer = 0.0;
          } else if (this.gameState === GameState.TIMER_STARTED) {
            // End the timer & read the number out loud
            this.gameState = GameState.TIMER_STOPPED;
            this.playGeneratedNumberAudio();
          }
      }
    },
    playGeneratedNumberAudio() {
      window.talkifyVoicePlayer.playText(this.localizedNumber);
    },
    generateVoicePlayer() {
      window.talkifyVoicePlayer = new window.talkify.Html5Player()
        .forceLanguage(this.gameSettings.voice.language)
        .usePitch(this.gameSettings.voice.pitch)
        .setRate(this.gameSettings.voice.rate);
    },
  },
};
</script>

<style scoped>
h1 {
  color: #42b983;
  font-size: xx-large;
}
</style>
