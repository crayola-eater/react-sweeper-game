import { renderHook, act } from "@testing-library/react-hooks";
import useGameManager from "./useGameManager";

describe("useGameManager hook initial state", () => {
  it("should expose an object with the correct interface", () => {
    const { result } = renderHook(() => useGameManager());

    expect(result.current).toEqual({
      gameHasStarted: true,
      gameHasBeenWon: null,
      gameHasBeenLost: null,
      setGameAsWon: expect.any(Function),
      setGameAsLost: expect.any(Function),
      setGameAsStarted: expect.any(Function),
    });
  });
});

describe("useGameManager hook methods", () => {
  it("should correctly set the game as won", () => {
    const { result } = renderHook(() => useGameManager());

    expect(result.current).toMatchObject({
      gameHasBeenWon: null,
      gameHasBeenLost: null,
    });

    act(() => {
      result.current.setGameAsWon();
    });

    expect(result.current).toMatchObject({
      gameHasBeenWon: true,
      gameHasBeenLost: false,
    });
  });

  it("should correctly set the game as lost", () => {
    const { result } = renderHook(() => useGameManager());

    expect(result.current).toMatchObject({
      gameHasBeenWon: null,
      gameHasBeenLost: null,
    });

    act(() => {
      result.current.setGameAsLost();
    });

    expect(result.current).toMatchObject({
      gameHasBeenWon: false,
      gameHasBeenLost: true,
    });
  });

  it("should correctly reset the game after a loss", () => {
    const { result } = renderHook(() => useGameManager());

    expect(result.current.gameHasStarted).toBe(true);

    act(() => {
      result.current.setGameAsLost();
    });

    expect(result.current).toMatchObject({
      gameHasStarted: true,
      gameHasBeenWon: false,
      gameHasBeenLost: true,
    });

    act(() => {
      result.current.setGameAsStarted();
    });

    expect(result.current).toMatchObject({
      gameHasStarted: true,
      gameHasBeenWon: null,
      gameHasBeenLost: null,
    });
  });

  it("should correctly reset the game after a win", () => {
    const { result } = renderHook(() => useGameManager());

    expect(result.current.gameHasStarted).toBe(true);

    act(() => {
      result.current.setGameAsWon();
    });

    expect(result.current).toMatchObject({
      gameHasStarted: true,
      gameHasBeenWon: true,
      gameHasBeenLost: false,
    });

    act(() => {
      result.current.setGameAsStarted();
    });

    expect(result.current).toMatchObject({
      gameHasStarted: true,
      gameHasBeenWon: null,
      gameHasBeenLost: null,
    });
  });
});
