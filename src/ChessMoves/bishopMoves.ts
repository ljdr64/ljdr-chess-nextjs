/**
 * Checks if all squares in a diagonal are empty.
 * @param {array} board - The board represented as a 2D array of characters.
 * @param {number} fromRank - The starting row.
 * @param {number} rank - The ending row.
 * @param {number} fromFile - The starting column.
 * @param {number} file - The ending column.
 * @returns {boolean} - True if all squares are empty, false otherwise.
 */
function areAllSquaresEmptyInDiagonal(board, fromRank, rank, fromFile, file) {
  const rankDirection = rank > fromRank ? 1 : -1;
  const fileDirection = file > fromFile ? 1 : -1;
  const steps = Math.abs(rank - fromRank);

  for (let i = 1; i < steps; i++) {
    const currentRank = fromRank + i * rankDirection;
    const currentFile = fromFile + i * fileDirection;
    if (board[currentRank][currentFile] !== 'empty') {
      return false;
    }
  }

  return true;
}

export function getBishopMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (Math.abs(rank - fromRank) === Math.abs(file - fromFile)) {
    if (areAllSquaresEmptyInDiagonal(board, fromRank, rank, fromFile, file)) {
      legalMoves = true;
    }
  }
  return legalMoves;
}
