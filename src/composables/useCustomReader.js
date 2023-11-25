import { useSpeechSynthesis } from "@vueuse/core";

export const useCustomReader = (text, voiceOptions) => {
  const { speak, stop, isSupported } = useSpeechSynthesis(text, voiceOptions);

  const playAudio = () => {
    // Need to stop, wait a tiny bit to start again for it to work.
    stop();
    setTimeout(speak, 10);
  };

  return { playAudio, isTTSSupported: isSupported };
};
