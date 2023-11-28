import { reactive } from "vue";

export const SUPPORTED_VOICE_LANGUAGES = [
  { title: "German", value: "de-DE" },
  { title: "English (UK)", value: "en-GB" },
  { title: "English (US)", value: "en-US" },
  { title: "Spanish (Spain)", value: "es-ES" },
  { title: "Spanish (Mexico)", value: "es-MX" },
  { title: "French", value: "fr-FR" },
  { title: "Italian", value: "it-IT" },
  { title: "Japanese", value: "ja-JP" },
  { title: "Korean", value: "ko-KR" },
  { title: "Swedish", value: "sv-SE" },
  { title: "Mandarin Chinese (Taiwan)", value: "zh-TW" },
];

export const SUPPORTED_DISPLAY_LANGUAGES = [
  { title: "English", value: "en-US" },
];

export const gameSettings = reactive({
  voice: {
    language: "es-ES",
    rate: 1.0,
    pitch: 1.0,
  },
  displayLanguage: "en-US",
  numberGeneratorMin: 0,
  numberGeneratorMax: 9999,
});
