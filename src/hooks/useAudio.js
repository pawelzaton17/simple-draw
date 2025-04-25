import { useMemo } from "react";

const useAudio = (audioFile, volume = 1.0) => {
  const audio = useMemo(() => {
    const sound = new Audio(audioFile);
    sound.volume = volume;
    return sound;
  }, [audioFile, volume]);

  const play = () => {
    audio.currentTime = 0;
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
  };

  return play;
};

export default useAudio;
