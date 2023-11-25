<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { gameSettings } from "@/scripts/gameSettings";
import { getRandomNumber } from "@/scripts/utils";
import KeyboardKey from "@/components/KeyboardKey.vue";
import { useCustomReader } from "@/composables/useCustomReader";

const GameState = {
  INITIAL: 0,
  TIMER_STARTED: 1,
  TIMER_STOPPED: 2,
};

const gameState = ref(GameState.INITIAL);
const generatedNumber = ref(undefined);
const timer = ref(undefined);
const localizedNumber = computed(() => {
  if (generatedNumber.value === undefined) return undefined;
  return generatedNumber.value.toLocaleString(gameSettings.voice.language);
});
const formattedTimerValue = computed(() => parseFloat(timer.value).toFixed(1));

const { playAudio, isTTSSupported } = useCustomReader(localizedNumber, {
  lang: computed(() => gameSettings.voice.language),
  pitch: computed(() => gameSettings.voice.pitch),
  rate: computed(() => gameSettings.voice.rate),
});

const handleKeydown = (event) => {
  switch (event.key) {
    case "R":
    case "r":
      if (gameState.value === GameState.TIMER_STOPPED) {
        playAudio();
      }
      return;
    case " ":
      if (
        gameState.value === GameState.INITIAL ||
        gameState.value === GameState.TIMER_STOPPED
      ) {
        // Generate new number & start the timer
        generatedNumber.value = getRandomNumber(
          gameSettings.numberGeneratorMin,
          gameSettings.numberGeneratorMax
        );

        gameState.value = GameState.TIMER_STARTED;
        timer.value = 0.0;
      } else if (gameState.value === GameState.TIMER_STARTED) {
        // End the timer & read the number out loud
        gameState.value = GameState.TIMER_STOPPED;
        playAudio();
      }
  }
};

watch(timer, (value) => {
  if (value === undefined) return;
  if (gameState.value != GameState.TIMER_STARTED) return;
  setTimeout(() => {
    timer.value += 0.1;
  }, 100);
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <v-alert
    v-if="!isTTSSupported"
    density="compact"
    type="warning"
    title="Not supported"
    text="It seems like text-to-speech is not available on your system. Switch to a different language and try again."
  ></v-alert>
  <v-container v-else class="fill-height flex-column">
    <v-row>
      <p v-if="timer !== undefined">
        {{ formattedTimerValue }}
      </p>
    </v-row>
    <v-row>
      <h1
        v-if="gameState === GameState.TIMER_STOPPED"
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
      <div v-if="gameState === GameState.INITIAL">
        <h3>Welcome to Read Aloud Practice</h3>
        <p>
          Press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          to start.
        </p>
      </div>
      <div v-if="gameState === GameState.TIMER_STARTED">
        <p>
          Read the number aloud and press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          once you are done.
        </p>
      </div>
      <div v-if="gameState === GameState.TIMER_STOPPED">
        <p>
          Press
          <KeyboardKey>Space <v-icon>mdi-keyboard-space</v-icon></KeyboardKey>
          to continue.
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<style scoped>
h1 {
  color: #42b983;
  font-size: xx-large;
}
</style>
