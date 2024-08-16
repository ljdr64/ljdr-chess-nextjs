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

/**
 * Converts a two-dimensional representation of a chessboard to FEN (Forsyth-Edwards Notation) string.
 * Transforms the board array into a FEN string format, including current turn, fullmove number,
 * castling availability, and en passant square information.
 *
 * @param {Array<Array<string>>} board - Two-dimensional array representing the chessboard.
 * @param {string} currentTurn - Current turn ('white' or 'black').
 * @param {number} fullmoveNumber - Fullmove number in the game.
 * @param {number} halfmoveNumber - Halfmove number in the game.
 * @param {string} castlingAvailability - Castling availability in FEN format ('KQkq' or '-' if none).
 * @param {string} enPassantSquare - En passant target square in algebraic notation ('e3' or '-' if none).
 * @returns {string} - FEN string representing the board state.
 */
export const board2DArrayToFEN = (
  board: Array<Array<string>>,
  currentTurn: string,
  fullmoveNumber: number,
  halfmoveNumber: number,
  castlingAvailability: string,
  enPassantSquare: string
): string => {
  const fenRows = board.map((row) => {
    let emptyCount = 0;
    return (
      row
        .map((cell) => {
          if (cell === 'empty') {
            emptyCount++;
            return '';
          } else {
            const result = (emptyCount > 0 ? emptyCount : '') + cell;
            emptyCount = 0;
            return result;
          }
        })
        .join('') + (emptyCount > 0 ? emptyCount : '')
    );
  });

  const fenTurn = currentTurn === 'white' ? 'b' : 'w';

  return (
    `${fenRows.join('/')}` +
    ` ${fenTurn}` +
    ` ${castlingAvailability}` +
    ` ${enPassantSquare}` +
    ` ${halfmoveNumber}` +
    ` ${fullmoveNumber}`
  );
};
