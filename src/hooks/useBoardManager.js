import { useCallback, useState } from "react";

function createPositionsForBadSquares({ height, width, numberOfBadSquares }) {
  return Array.from({ length: height * width }, (_, i) => {
    return {
      row: Math.floor(i / height),
      column: i % width,
      sortBy: Math.random(),
    };
  })
    .sort((a, b) => a.sortBy - b.sortBy)
    .slice(0, numberOfBadSquares);
}

function createInitialBoardState({ height, width, numberOfBadSquares }) {
  const emptyBoard = Array.from({ length: height }, (_, row) => {
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
  });

  const badSquarePositions = createPositionsForBadSquares({
    height,
    width,
    numberOfBadSquares,
  });
  const boardWithBadSquares = badSquarePositions.reduce(
    (board, { row, column }) => {
      board[row][column].isBad = true;

      const rowsToUpdate = [-1, 0, 1]
        .map((i) => row + i)
        .filter((r) => r >= 0 && r < height);

      const columnsToUpdate = [-1, 0, 1]
        .map((i) => column + i)
        .filter((r) => r >= 0 && r < width);

      rowsToUpdate.forEach((rowToUpdate) => {
        columnsToUpdate.forEach((columnToUpdate) => {
          if (!(row === rowToUpdate && column === columnToUpdate)) {
            board[rowToUpdate][columnToUpdate].neighbour++;
          }
        });
      });

      return board;
    },
    emptyBoard.map((row) => row.map((square) => ({ ...square })))
  );

  const finalBoard = boardWithBadSquares.map((row) => {
    return row.map((square) => {
      return {
        ...square,
        isEmpty: !square.isBad && 0 === square.neighbour,
      };
    });
  });

  return finalBoard;
}

export default function useBoardManager({ height, width, numberOfBadSquares }) {
  const [board, setBoard] = useState(
    createInitialBoardState({ height, width, numberOfBadSquares })
  );

  const counts = board.reduce(
    (acc, row) => {
      row.forEach((square) => {
        if (square.isFlagged) {
          acc.flagsUsed++;
        } else if (!square.isRevealed && !square.isFlagged) {
          acc.squaresLeft++;
        }
      });
      return acc;
    },
    { squaresLeft: 0, flagsUsed: 0 }
  );

  const setAllSquaresAsRevealed = useCallback(() => {
    setBoard((prev) => {
      return prev.map((row) => {
        return row.map((item) => {
          return { ...item, isRevealed: true };
        });
      });
    });
  }, []);

  const setSquare = (row, column, setFunc) => {
    setBoard((prev) => {
      const updatedValue = setFunc(prev[row][column]);
      const updatedRow = [
        ...prev[row].slice(0, column),
        updatedValue,
        ...prev[row].slice(column + 1),
      ];
      return [...prev.slice(0, row), updatedRow, ...prev.slice(row + 1)];
    });
  };

  const setSquareAsRevealed = useCallback((row, column) => {
    setSquare(row, column, (prev) => ({ ...prev, isRevealed: true }));
  }, []);

  const setSquareAsFlagged = useCallback((row, column) => {
    setSquare(row, column, (prev) => ({ ...prev, isFlagged: true }));
  }, []);

  const setSquareAsNotFlagged = useCallback((row, column) => {
    setSquare(row, column, (prev) => ({ ...prev, isFlagged: false }));
  }, []);

  const setEmptySquaresAsRevealed = useCallback(
    (row, column) => {
      setBoard((prev) => {
        const updatedData = prev.map((row) => {
          return row.map((square) => {
            return { ...square };
          });
        });

        const squaresToProcess = [[row, column]];

        while (squaresToProcess.length > 0) {
          const [row, column] = squaresToProcess.pop();
          const rowsToUpdate = [-1, 0, 1]
            .map((i) => row + i)
            .filter((r) => r >= 0 && r < height);
          const columnsToUpdate = [-1, 0, 1]
            .map((i) => column + i)
            .filter((r) => r >= 0 && r < width);

          rowsToUpdate.forEach((row) => {
            columnsToUpdate.forEach((column) => {
              const square = updatedData[row][column];
              if (!square.isRevealed && square.isEmpty) {
                square.isRevealed = true;
                square.isFlagged = false;
                squaresToProcess.push([row, column]);
              }
            });
          });
        }
        return updatedData;
      });
    },
    [height, width]
  );

  return {
    board,
    setAllSquaresAsRevealed,
    setSquareAsRevealed,
    setSquareAsFlagged,
    setSquareAsNotFlagged,
    setEmptySquaresAsRevealed,
    counts,
  };
}
