/**
 * Function that checks if a specific character is present in the castling availability section of a FEN.
 * @param {string} currentFEN - The full FEN notation.
 * @param {string} char - The character to look for (e.g., 'k', 'K', 'q', 'Q').
 * @returns {boolean} - Returns true if the character is present, otherwise false.
 */
function isCharInCastlingAvailability(currentFEN, char) {
  // Check if the specific character is present
  return currentFEN.split(' ')[2].includes(char);
}

export function getKingMoves(fromPiece, square, fromPosition, board, fen) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (Math.abs(rank - fromRank) <= 1 && Math.abs(file - fromFile) <= 1) {
    legalMoves = true;
  }

  // White: 0-0, 0-0-0
  if (fromPiece === 'K') {
    if (board[rank][file] === 'empty') {
      if (fromRank === 7 && rank === 7 && fromFile === 4) {
        if (
          (file === 6 &&
            isCharInCastlingAvailability(fen, 'K') &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file + 1] === 'R') ||
          (file === 2 &&
            isCharInCastlingAvailability(fen, 'Q') &&
            board[rank][file + 1] === 'empty' &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file - 2] === 'R')
        ) {
          legalMoves = true;
        }
      }
    }
  }

  // Black: 0-0, 0-0-0
  if (fromPiece === 'k') {
    if (board[rank][file] === 'empty') {
      if (fromRank === 0 && rank === 0 && fromFile === 4) {
        if (
          (file === 6 &&
            isCharInCastlingAvailability(fen, 'k') &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file + 1] === 'r') ||
          (file === 2 &&
            isCharInCastlingAvailability(fen, 'q') &&
            board[rank][file + 1] === 'empty' &&
            board[rank][file - 1] === 'empty' &&
            board[rank][file - 2] === 'r')
        ) {
          legalMoves = true;
        }
      }
    }
  }

  return legalMoves;
}
