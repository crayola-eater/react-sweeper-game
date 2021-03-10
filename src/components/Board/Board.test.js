import { render, fireEvent, act } from "@testing-library/react";
import Board from ".";

describe("Board component", () => {
  const [height, width] = [5, 5];

  let rendered, board;

  const testProps = {
    board: Array.from({ length: height }, (_, row) => {
      return Array.from({ length: width }, (_, column) => {
        return {
          column,
          row,
          isBad: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: null,
          isFlagged: false,
        };
      });
    }),
    handleLeftClickOnSquare: jest.fn(),
    handleRightClickOnSquare: jest.fn(),
  };

  beforeEach(() => {
    rendered = render(
      <Board
        board={testProps.board}
        handleLeftClickOnSquare={testProps.handleLeftClickOnSquare}
        handleRightClickOnSquare={testProps.handleRightClickOnSquare}
      />
    );
    [board] = rendered.container.children;
  });

  it("should display the correct number of squares", () => {
    expect(board.children).toHaveLength(height * width);
  });

  it("should have empty squares to begin with", () => {
    [...board.children].forEach((square) =>
      expect(square).toBeEmptyDOMElement()
    );
  });

  it("should invoke left click handler", () => {
    const [row, column] = [2, 2];
    const targetSquare = board.children[row * width + column];
    act(() => {
      fireEvent.click(targetSquare);
    });
    expect(testProps.handleLeftClickOnSquare).toHaveBeenCalledTimes(1);
    expect(testProps.handleLeftClickOnSquare).toHaveBeenCalledWith(row, column);
  });

  it("should invoke context menu handler", () => {
    const [row, column] = [3, 3];
    const targetSquare = board.children[row * width + column];
    act(() => {
      fireEvent.contextMenu(targetSquare);
    });
    expect(testProps.handleRightClickOnSquare).toHaveBeenCalledTimes(1);
    expect(testProps.handleRightClickOnSquare).toHaveBeenCalledWith(
      expect.objectContaining({ _reactName: "onContextMenu" }),
      row,
      column
    );
  });
});
