import { useCallback, useState } from "react";

export default function useGameManager() {
  const [gameHasStarted, setGameHasStarted] = useState(true);
  const [gameHasBeenWon, setGameHasBeenWon] = useState(null);
  const [gameHasBeenLost, setGameHasBeenLost] = useState(null);

  const setGameAsWon = useCallback(() => {
    setGameHasBeenWon(true);
    setGameHasBeenLost(false);
  }, []);

  const setGameAsLost = useCallback(() => {
    setGameHasBeenWon(false);
    setGameHasBeenLost(true);
  }, []);

  const setGameAsStarted = useCallback(() => {
    setGameHasStarted(true);
    setGameHasBeenWon(null);
    setGameHasBeenLost(null);
  }, []);

  return {
    gameHasStarted,
    gameHasBeenWon,
    gameHasBeenLost,
    setGameAsWon,
    setGameAsLost,
    setGameAsStarted,
  };
}
