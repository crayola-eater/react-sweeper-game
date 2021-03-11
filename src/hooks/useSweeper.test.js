import { renderHook, act } from "@testing-library/react-hooks";
import useSweeper from "./useSweeper";

const testProps = {
  height: 5,
  width: 5,
  numberOfBadSquares: 4,
};

describe("useSweeper hook initial state", () => {
  it("should expose an object with the correct interface", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    expect(result.current).toEqual({
      boardManager: expect.any(Object),
      gameManager: expect.any(Object),
      handlers: {
        handleLeftClickOnSquare: expect.any(Function),
        handleRightClickOnSquare: expect.any(Function),
      },
    });

    expect(result.current.boardManager.board).toHaveLength(testProps.height);
    expect(result.current.boardManager.board[0]).toHaveLength(testProps.width);
    expect(
      result.current.boardManager.board.flatMap((row) =>
        row.filter((square) => square.isBad)
      )
    ).toHaveLength(testProps.numberOfBadSquares);
  });
});

describe("useSweeper hook left click handler", () => {
  it("should correctly handle left click on an empty cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => square.isEmpty))
      .find((square) => square.isEmpty);

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      false
    );

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      true
    );
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
  });

  it("should correctly handle left click on a bad cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => square.isBad))
      .find((square) => square.isBad);

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      false
    );
    expect(result.current.gameManager.gameHasBeenLost).toBeNull();

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(
      result.current.boardManager.board.every((row) =>
        row.every((square) => square.isRevealed)
      )
    ).toBe(true);
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: true,
      gameHasBeenWon: false,
    });
  });

  it("should correctly handle left click on a non-bad, non-empty cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad && !square.isEmpty))
      .find((square) => !square.isBad && !square.isEmpty);

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      false
    );

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      true
    );
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
  });

  it("should correctly handle left click on an already revealed cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad))
      .find((square) => !square.isBad);

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      true
    );
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });

    const board = result.current.boardManager.board;
    const game = result.current.gameManager;

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board).toEqual(board);
    expect(result.current.gameManager).toEqual(game);
  });

  it("should correctly handle left click on a flagged cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad))
      .find((square) => !square.isBad);

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column]).toMatchObject({
      isRevealed: false,
      isFlagged: true,
    });
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board[row][column]).toMatchObject({
      isRevealed: true,
      isFlagged: false,
    });

    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
  });
});

describe("useSweeper hook right click handler", () => {
  it("should correctly handle right click on an empty cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => square.isEmpty))
      .find((square) => square.isEmpty);

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(
      false
    );

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(true);
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should correctly handle right click on a bad cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => square.isBad))
      .find((square) => square.isBad);

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(
      false
    );

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(true);
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should correctly handle right click on a non-bad, non-empty cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad && !square.isEmpty))
      .find((square) => !square.isBad && !square.isEmpty);

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(
      false
    );

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(true);
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should correctly handle right click on an already revealed cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad))
      .find((square) => !square.isBad);

    act(() => {
      result.current.handlers.handleLeftClickOnSquare(row, column);
    });

    expect(result.current.boardManager.board[row][column].isRevealed).toBe(
      true
    );
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });

    const board = result.current.boardManager.board;
    const game = result.current.gameManager;

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board).toEqual(board);
    expect(result.current.gameManager).toEqual(game);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it("should correctly handle right click on an already flagged cell", () => {
    const { result } = renderHook(() => useSweeper(testProps));
    const event = {
      preventDefault: jest.fn(),
    };

    const { row, column } = result.current.boardManager.board
      .find((row) => row.some((square) => !square.isBad))
      .find((square) => !square.isBad);

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(true);
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
    expect(event.preventDefault).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handlers.handleRightClickOnSquare(event, row, column);
    });

    expect(result.current.boardManager.board[row][column].isFlagged).toBe(
      false
    );
    expect(result.current.gameManager).toMatchObject({
      gameHasBeenLost: null,
      gameHasBeenWon: null,
    });
    expect(event.preventDefault).toHaveBeenCalledTimes(2);
  });
});
