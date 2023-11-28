import { useSpeechSynthesis } from "@vueuse/core";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const useCustomReader = (text, voiceOptions) => {
  const { speak, stop, isSupported, isPlaying } = useSpeechSynthesis(
    text,
    voiceOptions
  );

  const playAudio = async () => {
    // Need to stop, wait a tiny bit to start again for it to work.
    if (isPlaying) {
      stop();
      await sleep(10);
    }
    speak();
  };

  return { playAudio, isTTSSupported: isSupported, stopAudio: stop };
};
