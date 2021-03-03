import React from "react";
import Square from "../Square";
import styled from "styled-components";

const BoardContainer = styled.div`
  display: grid;
  gap: 3px;
  height: 90vmin;
  width: 90vmin;
  grid-template-columns: repeat(${({ boardWidth }) => boardWidth}, 1fr);
  grid-template-rows: repeat(${({ boardHeight }) => boardHeight}, 1fr);
  font-family: "DotGothic16", sans-serif;
  font-weight: bold;
`;

export default function Board({
  board,
  handleLeftClickOnSquare,
  handleRightClickOnSquare,
}) {
  return (
    <BoardContainer boardHeight={board.length} boardWidth={board[0].length}>
      {board.map((row) => {
        return row.map((square) => {
          return (
            <Square
              key={`${square.row}:${square.column}`}
              handleClick={() =>
                handleLeftClickOnSquare(square.row, square.column)
              }
              handleContextMenu={(e) =>
                handleRightClickOnSquare(e, square.row, square.column)
              }
              square={square}
            />
          );
        });
      })}
    </BoardContainer>
  );
}
