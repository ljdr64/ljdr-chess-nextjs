/**
 * Function that extracts the en passant square from a FEN notation.
 * @param {string} currentFEN - The full FEN notation.
 * @returns {string} - The en passant square (e.g., 'e3', 'd6'), or '-' if not available.
 */
function getEnPassantSquare(currentFEN) {
  // Split the FEN notation into its components and return the 4th element
  return currentFEN.split(' ')[3];
}

export function getPawnMoves(fromPiece, square, fromPosition, board, fen) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (fromPiece === 'P') {
    if (board[rank][file] === 'empty') {
      if (
        file === fromFile &&
        (fromRank - rank === 1 ||
          (board[5][file] === 'empty' &&
            fromRank === 6 &&
            fromRank - rank === 2))
      ) {
        legalMoves = true;
      }
      if (
        Math.abs(file - fromFile) === 1 &&
        fromRank - rank === 1 &&
        getEnPassantSquare(fen) === square
      ) {
        legalMoves = true;
      }
    } else if (Math.abs(file - fromFile) === 1 && fromRank - rank === 1) {
      legalMoves = true;
    }
  }

  if (fromPiece === 'p') {
    if (board[rank][file] === 'empty') {
      if (
        file === fromFile &&
        (rank - fromRank === 1 ||
          (board[2][file] === 'empty' &&
            fromRank === 1 &&
            rank - fromRank === 2))
      ) {
        legalMoves = true;
      }
      if (
        Math.abs(file - fromFile) === 1 &&
        rank - fromRank === 1 &&
        getEnPassantSquare(fen) === square
      ) {
        legalMoves = true;
      }
    } else if (Math.abs(file - fromFile) === 1 && rank - fromRank === 1) {
      legalMoves = true;
    }
  }

  return legalMoves;
}
