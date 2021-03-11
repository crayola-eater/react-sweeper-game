import { render, fireEvent, act } from "@testing-library/react";
import Square from ".";

const unrevealedEmptySquare = {
  row: 0,
  column: 1,
  isBad: false,
  neighbour: 0,
  isRevealed: false,
  isEmpty: false,
};
const revealedEmptySquare = { ...unrevealedEmptySquare, isRevealed: true };
const unrevealedBadSquare = { ...unrevealedEmptySquare, isBad: true };
const revealedBadSquare = { ...unrevealedBadSquare, isRevealed: true };
const unrevealedFlaggedSquare = { ...unrevealedEmptySquare, isFlagged: true };
const revealedFlaggedSquare = {
  unrevealedFlaggedSquare,
  neighbour: 6,
  isRevealed: true,
};
const unrevealedNeighbourSquare = { ...unrevealedEmptySquare, number: 4 };
const revealedNeighbourSquare = {
  ...unrevealedNeighbourSquare,
  isRevealed: true,
  neighbour: 1,
};

const testProps = {
  handleClick: jest.fn(),
  handleContextMenu: jest.fn(),
};

describe("Square component", () => {
  beforeEach(() => {
    testProps.handleClick.mockReset();
    testProps.handleContextMenu.mockReset();
  });

  it("should render 'unrevealed empty square' correctly", () => {
    const { container } = render(
      <Square
        square={unrevealedEmptySquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toBeEmptyDOMElement();
  });

  it("should render 'revealed empty square' correctly", () => {
    const { container } = render(
      <Square
        square={revealedEmptySquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toBeEmptyDOMElement();
  });

  it("should render 'unrevealed bad square' correctly", () => {
    const { container } = render(
      <Square
        square={unrevealedBadSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toBeEmptyDOMElement();
  });

  it("should render 'revealed bad square' correctly", () => {
    const { container } = render(
      <Square
        square={revealedBadSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toHaveTextContent("🧟");
  });

  it("should render 'unrevealed flagged square' correctly", () => {
    const { container } = render(
      <Square
        square={unrevealedFlaggedSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toHaveTextContent("🚩");
  });

  it("should render 'revealed flagged square' correctly", () => {
    const { container } = render(
      <Square
        square={revealedFlaggedSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toHaveTextContent(
      revealedFlaggedSquare.neighbour
    );
  });

  it("should render 'unrevealed neighbour square' correctly", () => {
    const { container } = render(
      <Square
        square={unrevealedNeighbourSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toBeEmptyDOMElement();
  });

  it("should render 'revealed neighbour square' correctly", () => {
    const { container } = render(
      <Square
        square={revealedNeighbourSquare}
        handleClick={testProps.handleClick}
        handleContextMenu={testProps.handleContextMenu}
      />
    );
    expect(container.children[0]).toHaveTextContent(
      revealedNeighbourSquare.neighbour
    );
  });

  const squaresToTest = {
    unrevealedEmptySquare,
    revealedEmptySquare,
    unrevealedBadSquare,
    revealedBadSquare,
    unrevealedFlaggedSquare,
    revealedFlaggedSquare,
    unrevealedNeighbourSquare,
    revealedNeighbourSquare,
  };

  Object.entries(squaresToTest).forEach(([squareName, square]) => {
    const squareLabel = squareName.replace(
      /[A-Z]/g,
      (letter) => ` ${letter.toLowerCase()}`
    );

    it(`should invoke click handlers for '${squareLabel}'`, () => {
      const { container } = render(
        <Square
          square={square}
          handleClick={testProps.handleClick}
          handleContextMenu={testProps.handleContextMenu}
        />
      );
      const renderedSquare = container.children[0];

      act(() => {
        fireEvent.click(renderedSquare);
      });

      expect(testProps.handleClick).toHaveBeenCalledTimes(1);

      act(() => {
        fireEvent.contextMenu(renderedSquare);
      });

      expect(testProps.handleContextMenu).toHaveBeenCalledTimes(1);
    });
  });
});
