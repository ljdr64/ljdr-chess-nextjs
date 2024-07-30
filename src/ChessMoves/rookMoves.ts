/**
 * Checks if all squares in a row are empty.
 * @param {array} board - The board represented as a 2D array of characters.
 * @param {number} rank - The row to check.
 * @param {number} fromFile - The starting column.
 * @param {number} file - The ending column.
 * @returns {boolean} - True if all squares are empty, false otherwise.
 */
function areAllSquaresEmptyInRank(board, rank, fromFile, file) {
  const start = Math.min(fromFile, file);
  const end = Math.max(fromFile, file);
  for (let currentFile = start + 1; currentFile < end; currentFile++) {
    if (board[rank][currentFile] !== 'empty') {
      return false;
    }
  }
  return true;
}

/**
 * Checks if all squares in a column are empty.
 * @param {array} board - The board represented as a 2D array of characters.
 * @param {number} file - The column to check.
 * @param {number} fromRank - The starting row.
 * @param {number} rank - The ending row.
 * @returns {boolean} - True if all squares are empty, false otherwise.
 */
function areAllSquaresEmptyInFile(board, file, fromRank, rank) {
  const start = Math.min(fromRank, rank);
  const end = Math.max(fromRank, rank);
  for (let currentRank = start + 1; currentRank < end; currentRank++) {
    if (board[currentRank][file] !== 'empty') {
      return false;
    }
  }
  return true;
}

export function getRookMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (rank === fromRank || file === fromFile) {
    if (rank === fromRank) {
      legalMoves = areAllSquaresEmptyInRank(board, rank, fromFile, file);
    }
    if (file === fromFile) {
      legalMoves = areAllSquaresEmptyInFile(board, file, fromRank, rank);
    }
  }
  return legalMoves;
}
