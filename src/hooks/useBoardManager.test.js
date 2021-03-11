import { act, renderHook } from "@testing-library/react-hooks";
import useBoardManager from "./useBoardManager";

const testProps = {
  height: 5,
  width: 5,
  numberOfBadSquares: 5,
};

describe("useBoardManager hook initial state", () => {
  it("should expose an object with the correct interface", () => {
    const { result } = renderHook(() => useBoardManager(testProps));

    expect(result.current).toMatchObject({
      board: expect.any(Array),
      counts: {
        squaresLeft: testProps.height * testProps.width,
        flagsUsed: 0,
      },
      setAllSquaresAsRevealed: expect.any(Function),
      setSquareAsRevealed: expect.any(Function),
      setSquareAsFlagged: expect.any(Function),
      setSquareAsNotFlagged: expect.any(Function),
      setEmptySquaresAsRevealed: expect.any(Function),
    });

    result.current.board.forEach((row, rowIndex) => {
      row.forEach((square, columnIndex) => {
        expect(square).toEqual({
          column: columnIndex,
          row: rowIndex,
          isBad: expect.any(Boolean),
          neighbour: expect.any(Number),
          isRevealed: false,
          isEmpty: expect.any(Boolean),
          isFlagged: false,
        });
      });
    });
  });

  it(`should have ${testProps.numberOfBadSquares} bad squares`, () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const board = result.current.board;
    expect(
      board.flatMap((row) => row.filter(({ isBad }) => isBad))
    ).toHaveLength(testProps.numberOfBadSquares);
  });

  it("should contain correct counts for neighbours", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const board = result.current.board;

    board.forEach((row) => {
      row
        .filter((square) => !square.isBad)
        .forEach((square) => {
          const badNeighbours = [-1, 0, 1]
            .flatMap((rowOffset) => {
              return [-1, 0, 1].map(
                (columnOffset) =>
                  board[square.row + rowOffset]?.[square.column + columnOffset]
              );
            })
            .filter((neighbour) => neighbour?.isBad);
          expect(badNeighbours).toHaveLength(square.neighbour);
        });
    });
  });

  it("should mark empty squares correctly", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    result.current.board.forEach((row) => {
      row.forEach((square) => {
        expect(square.isEmpty).toBe(!square.isBad && 0 === square.neighbour);
      });
    });
  });
});

describe("useBoardManager hook methods", () => {
  it("should set all squares as revealed", () => {
    const { result } = renderHook(() => useBoardManager(testProps));

    expect(
      result.current.board.every((row) =>
        row.every((square) => !square.isRevealed)
      )
    ).toBe(true);

    expect(result.current.counts.squaresLeft).toBe(
      testProps.height * testProps.width
    );

    act(() => {
      result.current.setAllSquaresAsRevealed();
    });

    expect(
      result.current.board.every((row) =>
        row.every((square) => square.isRevealed)
      )
    ).toBe(true);

    expect(result.current.counts.squaresLeft).toBe(0);
  });

  it("should set a particular square as revealed", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const [row, column] = [2, 4];

    expect(result.current.board[row][column].isRevealed).toBe(false);
    expect(result.current.counts.squaresLeft).toBe(
      testProps.height * testProps.width
    );

    act(() => {
      result.current.setSquareAsRevealed(row, column);
    });

    expect(result.current.board[row][column].isRevealed).toBe(true);
    expect(result.current.counts.squaresLeft).toBe(
      testProps.height * testProps.width - 1
    );
  });

  it("should set a particular square as flagged", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const [row, column] = [1, 3];

    expect(result.current.board[row][column].isFlagged).toBe(false);
    expect(result.current.counts).toEqual({
      squaresLeft: testProps.height * testProps.width,
      flagsUsed: 0,
    });

    act(() => {
      result.current.setSquareAsFlagged(row, column);
    });

    expect(result.current.board[row][column].isFlagged).toBe(true);
    expect(result.current.counts).toEqual({
      squaresLeft: testProps.height * testProps.width - 1,
      flagsUsed: 1,
    });
  });

  it("should set a particular square as not flagged", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const [row, column] = [2, 0];

    expect(result.current.board[row][column].isFlagged).toBe(false);
    expect(result.current.counts).toEqual({
      squaresLeft: testProps.height * testProps.width,
      flagsUsed: 0,
    });

    act(() => {
      result.current.setSquareAsFlagged(row, column);
    });

    expect(result.current.board[row][column].isFlagged).toBe(true);
    expect(result.current.counts).toEqual({
      squaresLeft: testProps.height * testProps.width - 1,
      flagsUsed: 1,
    });

    act(() => {
      result.current.setSquareAsNotFlagged(row, column);
    });

    expect(result.current.board[row][column].isFlagged).toBe(false);
    expect(result.current.counts).toEqual({
      squaresLeft: testProps.height * testProps.width,
      flagsUsed: 0,
    });
  });

  it("should set neighbouring empty squares as unrevealed", () => {
    const { result } = renderHook(() => useBoardManager(testProps));
    const board = result.current.board;

    expect(
      board.every((row) => row.every((square) => !square.isRevealed))
    ).toBe(true);
    expect(result.current.counts.squaresLeft).toBe(
      testProps.height * testProps.width
    );

    const { row, column } = board
      .find((row) => row.some((square) => square.isEmpty))
      .find((square) => square.isEmpty);

    act(() => {
      result.current.setEmptySquaresAsRevealed(row, column);
    });

    expect(
      board.every((row) =>
        row.every(
          (square) =>
            !square.isRevealed || (square.isRevealed && square.isEmpty)
        )
      )
    ).toBe(true);
    expect(result.current.counts.squaresLeft).toBeLessThan(
      testProps.height * testProps.width
    );
  });
});
