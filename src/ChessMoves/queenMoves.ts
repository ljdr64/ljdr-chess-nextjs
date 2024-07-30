import { getRookMoves } from './rookMoves';
import { getBishopMoves } from './bishopMoves';

export function getQueenMoves(fromPiece, square, fromPosition, board) {
  let legalMoves = false;

  if (
    getRookMoves(fromPiece, square, fromPosition, board) ||
    getBishopMoves(fromPiece, square, fromPosition, board)
  ) {
    legalMoves = true;
  }

  return legalMoves;
}
