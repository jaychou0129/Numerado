import { reactive } from "vue";

export const gameSettings = reactive({
  voiceLanguage: "es-ES",
  displayLanguage: "en-US",
  numberGeneratorMin: 0,
  numberGeneratorMax: 9999,
});
