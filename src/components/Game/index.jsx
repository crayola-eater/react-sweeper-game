import React, { useEffect } from "react";
import {
  BOARD_COLUMN_COUNT,
  BOARD_ROW_COUNT,
  NUMBER_OF_BAD_SQUARES,
} from "../../config/board";
import useSweeper from "../../hooks/useSweeper";
import Board from "../Board";
import Instructions from "../Instructions";

import styled from "styled-components";

const StyledGame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "DotGothic16", sans-serif;
  letter-spacing: 0.1rem;
  line-height: 1.5rem;
`;

export default function Game({
  height = BOARD_ROW_COUNT,
  width = BOARD_COLUMN_COUNT,
  numberOfBadSquares = NUMBER_OF_BAD_SQUARES,
}) {
  const {
    boardManager,
    gameManager,
    handlers: { handleLeftClickOnSquare, handleRightClickOnSquare },
  } = useSweeper({ height, width, numberOfBadSquares });

  /**
   * Just for debugging.
   * Disable if (ever) deployed/in production environment.
   */
  useEffect(() => {
    console.table(
      boardManager.board.map((row) => {
        return row.map((square) => {
          if (square.isEmpty) return "-";
          if (square.isBad) return "Z";
          if (square.isFlagged) return "F";
          return square.neighbour;
        });
      })
    );
  }, [boardManager.board]);

  /**
   * Should swap these alerts out for modal.
   */
  useEffect(() => {
    if (gameManager.gameHasBeenWon) {
      alert("You win!");
    } else if (gameManager.gameHasBeenLost) {
      alert("You lost!");
    }
  }, [gameManager.gameHasBeenWon, gameManager.gameHasBeenLost]);

  return (
    <StyledGame>
      <h1>Zombie Sweeper</h1>
      <Instructions />
      <p className="info">
        {gameManager.gameHasBeenWon ? "You win" : null}
        {gameManager.gameHasBeenLost ? "You lose" : null}
        {!gameManager.gameHasBeenLost && !gameManager.gameHasBeenWon
          ? `Flags left: ${numberOfBadSquares - boardManager.counts.flagsUsed}`
          : null}
      </p>
      <Board
        board={boardManager.board}
        handleLeftClickOnSquare={handleLeftClickOnSquare}
        handleRightClickOnSquare={handleRightClickOnSquare}
      />
    </StyledGame>
  );
}
