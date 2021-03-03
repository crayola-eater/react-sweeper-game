import React from "react";
import styled from "styled-components";

const StyledSquare = styled.div`
  box-shadow: 0 0 2px rgba(10, 10, 10, 0.5);
  background-color: ${({ square }) => {
    if (square.isRevealed && square.isBad) {
      return;
    } else if (square.isRevealed && square.isEmpty) {
      return "lightgrey";
    }
  }};
  &:hover {
    box-shadow: 0 0 3px 2px rgba(167, 167, 167, 0.5);
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  color: ${({ square }) => {
    return (
      [
        "black",
        "rgb(239, 100, 50)",
        "rgb(239, 50, 50)",
        "rgb(200, 0, 50)",
        "rgb(150, 0, 50)",
        "rgb(100, 0, 50)",
        "rgb(50, 0, 50)",
      ][square.neighbour] ?? "black"
    );
  }};
`;

const getDisplayValue = (square) => {
  if (!square.isRevealed) {
    return square.isFlagged ? "🚩" : null;
  }
  if (square.isBad) {
    return "🧟";
  }
  return square.neighbour || null;
};

export default function Square({ square, handleClick, handleContextMenu }) {
  const displayValue = getDisplayValue(square);
  return (
    <StyledSquare
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      square={square}
    >
      {displayValue ? <p>{displayValue}</p> : null}
    </StyledSquare>
  );
}
