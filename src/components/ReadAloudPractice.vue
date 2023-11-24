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
          <p align="center">( <v-icon>mdi-keyboard</v-icon> R )</p></v-tooltip
        >
        <span> {{ generatedNumber }}</span>
      </h1>
      <h1 v-else class="display-1">
        {{ generatedNumber }}
      </h1>
    </v-row>
    <v-row>
      <div v-if="gameState === 0">
        <p>Press Space <v-icon>mdi-keyboard-space</v-icon> to start.</p>
      </div>
      <div v-if="gameState === 1">
        <p>
          Press Space <v-icon>mdi-keyboard-space</v-icon> after you are done to
          stop the timer.
        </p>
      </div>
      <div v-if="gameState === 2">
        <p>Press Space <v-icon>mdi-keyboard-space</v-icon> to continue.</p>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import { gameSettings } from "@/scripts/gameSettings";
import "talkify-tts";
const GameState = {
  INITIAL: 0,
  TIMER_STARTED: 1,
  TIMER_ENDED: 2,
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const player = new window.talkify.Html5Player().forceLanguage(
  gameSettings.voiceLanguage
);

export default {
  name: "ReadAloudPractice",
  data: () => ({
    gameState: GameState.INITIAL,
    generatedNumber: undefined,
    timer: undefined,
    gameSettings,
  }),
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
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    handleKeydown(event) {
      if (event.key !== " " && event.key !== "r" && event.key !== "R") return;

      switch (event.key) {
        case "R":
        case "r":
          if (this.gameState === GameState.TIMER_ENDED)
            this.playGeneratedNumberAudio();
          return;
        case " ":
          if (
            this.gameState === GameState.INITIAL ||
            this.gameState === GameState.TIMER_ENDED
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
            this.gameState = GameState.TIMER_ENDED;
            this.playGeneratedNumberAudio();
          }
      }
    },
    playGeneratedNumberAudio() {
      player.playText(String(this.generatedNumber));
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
