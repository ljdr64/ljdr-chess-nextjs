/**
 * Converts a FEN (Forsyth-Edwards Notation) string into a two-dimensional representation of a chessboard.
 * Parses the FEN string to populate the board with pieces and empty squares.
 *
 * @param {string} fen - FEN string representing the board state.
 * @returns {Array<Array<string>>} - Two-dimensional array representing the chessboard.
 */
export const FENToBoard2DArray = (fen: string): Array<Array<string>> => {
  const [position] = fen.split(' ');
  const rows = position.split('/');
  const board: Array<Array<string>> = Array.from({ length: 8 }, () =>
    Array(8).fill('empty')
  );

  rows.forEach((row, rowIndex) => {
    let fileIndex = 0;
    for (const char of row) {
      if (!isNaN(Number(char))) {
        fileIndex += parseInt(char, 10);
      } else {
        board[rowIndex][fileIndex] = char;
        fileIndex++;
      }
    }
  });

  return board;
};
