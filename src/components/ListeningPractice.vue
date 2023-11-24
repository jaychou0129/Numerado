<template>
  <v-container class="fill-height flex-column">
    <v-row>
      <p v-if="timer !== undefined">
        {{ parseFloat(timer).toFixed(1) }}
      </p>
    </v-row>
    <v-row>
      <div v-if="gameState === 0">
        <h3>Welcome to Listening Practice</h3>
        <p>
          Press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          to start.
        </p>
      </div>
      <div v-if="gameState === 1">
        <v-text-field
          width="500px"
          variant="outlined"
          ref="UserInputTextbox"
          v-model="userInput"
        ></v-text-field>
        <p>Enter the number you heard (all formatting will be auto-ignored).</p>
      </div>
      <div v-if="gameState === 2">
        <h1 class="display-1">
          {{ localizedNumber }}
        </h1>
        <p>
          You got it! Press
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
    userInput: "",
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
    userInputNumber() {
      const userInputFiltered = this.userInput.replace(/\D/g, "");
      if (userInputFiltered == "") return undefined;
      return parseInt(userInputFiltered);
    },
  },
  watch: {
    userInputNumber: {
      handler(guessedValue) {
        if (guessedValue !== this.generatedNumber) return;

        // Stop the timer
        this.gameState = GameState.TIMER_STOPPED;
      },
    },
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
          if (this.gameState === GameState.TIMER_STARTED) {
            this.playGeneratedNumberAudio();
            event.preventDefault();
          }
          return;
        case " ":
          if (
            this.gameState === GameState.INITIAL ||
            this.gameState === GameState.TIMER_STOPPED
          ) {
            // Generate new number & start the timer & play the audio
            this.generatedNumber = getRandomNumber(
              gameSettings.numberGeneratorMin,
              gameSettings.numberGeneratorMax
            );

            this.gameState = GameState.TIMER_STARTED;
            this.timer = 0.0;
            this.userInput = "";
            setTimeout(() => {
              this.$refs.UserInputTextbox.focus();
            });
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
