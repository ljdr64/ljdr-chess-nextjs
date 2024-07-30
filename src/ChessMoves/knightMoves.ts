export function getKnightMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  const file = square[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - square[1];

  const fromFile = fromPosition[0].charCodeAt(0) - 'a'.charCodeAt(0);
  const fromRank = 8 - fromPosition[1];

  if (
    (Math.abs(rank - fromRank) === 2 && Math.abs(file - fromFile) === 1) ||
    (Math.abs(rank - fromRank) === 1 && Math.abs(file - fromFile) === 2)
  ) {
    legalMoves = true;
  }
  return legalMoves;
}
