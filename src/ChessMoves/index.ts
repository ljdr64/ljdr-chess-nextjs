import { getRookMoves } from './rookMoves';
import { getBishopMoves } from './bishopMoves';
import { getKnightMoves } from './knightMoves';
import { getQueenMoves } from './queenMoves';
import { getKingMoves } from './kingMoves';
import { getPawnMoves } from './pawnMoves';
import { updateBoard2DArrayPosition } from '../utils';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../KingInCheck';

/**
 * Function to check if a move is legal for a piece at a given position.
 * @param {string} fromPiece - The piece type ('r', 'b', 'n', 'q', 'k', 'p' for rook, bishop, knight, queen, king, pawn respectively).
 * @param {array} square - The target square [row, column].
 * @param {array} fromPosition - The piece's current position [row, column].
 * @param {array} board - The board represented as a 2D array of characters.
 * @param {string} fen - The current FEN notation of the board.
 * @returns {boolean} - true if the move is legal, false otherwise.
 */
export function isMoveLegal(fromPiece, square, fromPosition, board, fen) {
  let isCurrentMoveLegal = false;

  const firstRow = fen.split(' ')[0].split('/')[0];
  const lastRow = fen.split(' ')[0].split('/')[7];
  const turn = fen.split(' ')[1];
  
  const newBoard = updateBoard2DArrayPosition(board, fromPosition, square)[0];

  if (firstRow.includes('P') || lastRow.includes('p')) {
    return false;
  }

  if ((turn === 'w' && fromPiece === fromPiece.toLowerCase()) || 
      (turn === 'b' && fromPiece === fromPiece.toUpperCase())) {
    return false;
  }

  if ((turn === 'w' && fromPiece === fromPiece.toLowerCase()) || 
      (turn === 'b' && fromPiece === fromPiece.toUpperCase())) {
    return false;
  }

  if ((fromPiece === fromPiece.toUpperCase() && isWhiteKingInCheck(newBoard)) ||
      (fromPiece === fromPiece.toLowerCase() && isBlackKingInCheck(newBoard))) {
    return false;
  }

  if (fromPiece === 'K' && fromPosition === 'e1') {
    if ((square === 'g1' || square === 'c1') && isWhiteKingInCheck(board)) {
      return false;
    }
    if (square === 'g1' && isWhiteKingInCheck(updateBoard2DArrayPosition(board, fromPosition, 'f1')[0])) {
      return false;
    }  
    if (square === 'c1' && isWhiteKingInCheck(updateBoard2DArrayPosition(board, fromPosition, 'd1')[0])) {
      return false;
    }  
  }

  if (fromPiece === 'k' && fromPosition === 'e8') {
    if ((square === 'g8' || square === 'c8') && isBlackKingInCheck(board)) {
      return false;
    }
    if (square === 'g8' && isBlackKingInCheck(updateBoard2DArrayPosition(board, fromPosition, 'f8')[0])) {
      return false;
    }  
    if (square === 'c8' && isBlackKingInCheck(updateBoard2DArrayPosition(board, fromPosition, 'd8')[0])) {
      return false;
    }  
  }
  
  switch (fromPiece.toLowerCase()) {
    case 'r':
      isCurrentMoveLegal = getRookMoves(fromPiece, square, fromPosition, board);
      break;
    case 'b':
      isCurrentMoveLegal = getBishopMoves(fromPiece, square, fromPosition, board);
      break;
    case 'n':
      isCurrentMoveLegal = getKnightMoves(fromPiece, square, fromPosition, board);
      break;
    case 'q':
      isCurrentMoveLegal = getQueenMoves(fromPiece, square, fromPosition, board);
      break;
    case 'k':
      isCurrentMoveLegal = getKingMoves(fromPiece, square, fromPosition, board, fen);
      break;
    case 'p':
      isCurrentMoveLegal = getPawnMoves(fromPiece, square, fromPosition, board, fen);
      break;
    default:
      isCurrentMoveLegal = false;
      break;
  }

  return isCurrentMoveLegal;
}
