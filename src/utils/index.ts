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
  const fenRows: string[] = board.map((row) => {
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

  const fenTurn: string = currentTurn === 'white' ? 'b' : 'w';

  return (
    `${fenRows.join('/')}` +
    ` ${fenTurn} ${castlingAvailability} ${enPassantSquare} ${halfmoveNumber} ${fullmoveNumber}`
  );
};

/**
 * Updates a position on a two-dimensional representation of a chessboard.
 * Moves a piece from 'fromPosition' to 'toPosition', handling special cases
 * like pawn double advances, en passant captures, and castling.
 *
 * @param {Array<Array<string>>} board2DArray - Two-dimensional array representing the chessboard.
 * @param {string} fromPosition - Position of the piece to move (e.g., 'e2').
 * @param {string} toPosition - Destination position for the piece (e.g., 'e4').
 * @returns {[Array<Array<string>>, string]} - Updated board and the piece moved.
 */
export const updateBoard2DArrayPosition = (
  board2DArray: Array<Array<string>>,
  fromPosition: string,
  toPosition: string
): [Array<Array<string>>, string] => {
  const fromFile = fromPosition[0];
  const fromRank = fromPosition[1];
  const toFile = toPosition[0];
  const toRank = toPosition[1];
  const piece: string =
    board2DArray[8 - Number(fromRank)][
      fromFile.charCodeAt(0) - 'a'.charCodeAt(0)
    ];

  let newBoard2DArray: Array<Array<string>> = board2DArray.map((row) => [
    ...row,
  ]);

  if (
    piece === 'P' &&
    fromRank === '5' &&
    toRank === '6' &&
    Math.abs(fromFile.charCodeAt(0) - toFile.charCodeAt(0)) === 1 &&
    newBoard2DArray[2][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] === 'empty'
  ) {
    newBoard2DArray[3][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = 'empty';
  }

  if (
    piece === 'p' &&
    fromRank === '4' &&
    toRank === '3' &&
    Math.abs(fromFile.charCodeAt(0) - toFile.charCodeAt(0)) === 1 &&
    newBoard2DArray[5][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] === 'empty'
  ) {
    newBoard2DArray[4][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] = 'empty';
  }

  newBoard2DArray[8 - Number(toRank)][
    toFile.charCodeAt(0) - 'a'.charCodeAt(0)
  ] = piece;
  newBoard2DArray[8 - Number(fromRank)][
    fromFile.charCodeAt(0) - 'a'.charCodeAt(0)
  ] = 'empty';

  if (piece === 'K' && fromFile === 'e' && fromRank === '1' && toRank === '1') {
    if (toFile === 'g') {
      newBoard2DArray[7][5] = 'R';
      newBoard2DArray[7][7] = 'empty';
    }
    if (toFile === 'c') {
      newBoard2DArray[7][3] = 'R';
      newBoard2DArray[7][0] = 'empty';
    }
  }

  if (piece === 'k' && fromFile === 'e' && fromRank === '8' && toRank === '8') {
    if (toFile === 'g') {
      newBoard2DArray[0][5] = 'r';
      newBoard2DArray[0][7] = 'empty';
    }
    if (toFile === 'c') {
      newBoard2DArray[0][3] = 'r';
      newBoard2DArray[0][0] = 'empty';
    }
  }

  return [newBoard2DArray, piece];
};

/**
 * Promotes a pawn within a two-dimensional representation of a chessboard.
 * Updates the board by promoting the pawn located at 'fromPosition' to 'piecePromote'.
 *
 * @param {Array<Array<string>>} board2DArray - Two-dimensional array representing the chessboard.
 * @param {string} fromPosition - Position of the pawn to promote (e.g., 'e8').
 * @param {string} piecePromote - Piece to promote the pawn to (e.g., 'Q', 'R', 'B', 'N').
 * @returns {Array<Array<string>>} - Updated board with the promoted piece.
 */
export const promotionPieceInBoard2DArray = (
  board2DArray: Array<Array<string>>,
  fromPosition: string,
  piecePromote: string
): Array<Array<string>> => {
  const fromFile = fromPosition[0];
  const fromRank = fromPosition[1];
  let newBoard2DArray: Array<Array<string>> = board2DArray.map((row) => [
    ...row,
  ]);
  newBoard2DArray[8 - Number(fromRank)][
    fromFile.charCodeAt(0) - 'a'.charCodeAt(0)
  ] = piecePromote;

  return newBoard2DArray;
};
