<script setup>
import { watch, computed, ref, onMounted, onBeforeUnmount } from "vue";
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
const userInput = ref("");
const timer = ref(undefined);
const UserInputTextbox = ref();
const localizedNumber = computed(() => {
  if (generatedNumber.value === undefined) return undefined;
  return generatedNumber.value.toLocaleString(gameSettings.voice.language);
});
const userInputNumber = computed(() => {
  const userInputFiltered = userInput.value.replace(/\D/g, "");
  if (userInputFiltered == "") return undefined;
  return parseInt(userInputFiltered);
});

const { playAudio, isTTSSupported } = useCustomReader(localizedNumber, {
  lang: computed(() => gameSettings.voice.language),
  pitch: computed(() => gameSettings.voice.pitch),
  rate: computed(() => gameSettings.voice.rate),
});

const handleKeydown = (event) => {
  switch (event.key) {
    case "R":
    case "r":
      if (gameState.value === GameState.TIMER_STARTED) {
        playAudio();
        event.preventDefault();
      }
      return;
    case " ":
      if (
        gameState.value === GameState.INITIAL ||
        gameState.value === GameState.TIMER_STOPPED
      ) {
        // Generate new number & start the timer & play the audio
        generatedNumber.value = getRandomNumber(
          gameSettings.numberGeneratorMin,
          gameSettings.numberGeneratorMax
        );

        gameState.value = GameState.TIMER_STARTED;
        timer.value = 0.0;
        userInput.value = "";

        setTimeout(() => {
          UserInputTextbox.value.focus();
        });
        playAudio();
      }
  }
};

watch(userInputNumber, (guessedValue) => {
  if (guessedValue !== generatedNumber.value) return;

  // Stop the timer
  gameState.value = GameState.TIMER_STOPPED;
});
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

<style scoped>
h1 {
  color: #42b983;
  font-size: xx-large;
}
</style>
