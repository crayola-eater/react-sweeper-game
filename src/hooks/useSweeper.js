import { useEffect, useCallback } from "react";
import useBoardManager from "./useBoardManager";
import useGameManager from "./useGameManager";

export default function useSweeper({ height, width, numberOfBadSquares }) {
  const boardManager = useBoardManager({ height, width, numberOfBadSquares });
  const gameManager = useGameManager();

  useEffect(() => {
    if (boardManager.counts.squaresLeft > 0) {
      return;
    }
    const gameHasBeenWon = boardManager.board.every((row) => {
      return row.every((square) => {
        return (
          (square.isRevealed && !square.isBad) ||
          (square.isFlagged && square.isBad)
        );
      });
    });
    if (gameHasBeenWon) {
      gameManager.setGameAsWon.call(null);
    } else {
      gameManager.setGameAsLost.call(null);
    }
  }, [
    gameManager.setGameAsWon,
    gameManager.setGameAsLost,
    boardManager.board,
    boardManager.counts.squaresLeft,
  ]);

  const handleLeftClickOnSquare = useCallback(
    (row, column) => {
      const squareClicked = boardManager.board[row][column];
      if (squareClicked.isRevealed) {
        return;
      } else if (squareClicked.isBad) {
        gameManager.setGameAsLost.call(null);
        boardManager.setAllSquaresAsRevealed.call(null);
        return;
      }
      boardManager.setSquareAsNotFlagged.call(null, row, column);
      boardManager.setSquareAsRevealed.call(null, row, column);

      if (squareClicked.isEmpty) {
        boardManager.setEmptySquaresAsRevealed.call(null, row, column);
      }
    },
    [
      boardManager.board,
      boardManager.setSquareAsRevealed,
      boardManager.setAllSquaresAsRevealed,
      boardManager.setEmptySquaresAsRevealed,
      boardManager.setSquareAsNotFlagged,
      gameManager.setGameAsLost,
    ]
  );

  const handleRightClickOnSquare = useCallback(
    (e, row, column) => {
      e.preventDefault();
      const squareClicked = boardManager.board[row][column];
      if (
        squareClicked.isRevealed ||
        boardManager.counts.flagsUsed >= numberOfBadSquares
      ) {
        return;
      }
      if (squareClicked.isFlagged) {
        boardManager.setSquareAsNotFlagged.call(null, row, column);
      } else {
        boardManager.setSquareAsFlagged.call(null, row, column);
      }
    },
    [
      boardManager.board,
      boardManager.counts.flagsUsed,
      boardManager.setSquareAsFlagged,
      boardManager.setSquareAsNotFlagged,
      numberOfBadSquares,
    ]
  );

  return {
    boardManager,
    gameManager,
    handlers: {
      handleLeftClickOnSquare,
      handleRightClickOnSquare,
    },
  };
}
