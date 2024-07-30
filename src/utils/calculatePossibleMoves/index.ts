import { isMoveLegal } from '../../ChessMoves';
import { sameType } from '../sameType';

/**
 * Calculate all possible moves for a given piece from a given square.
 *
 * @param {string} piece - The piece for which to calculate possible moves (e.g., 'N' for knight, 'P' for pawn).
 * @param {string} fromSquare - The starting square of the piece (in algebraic notation, e.g., 'e4').
 * @param {string[][]} board - A 2D array representing the current state of the chessboard with pieces and 'empty' squares.
 * @param {string} fen - The current FEN notation representing the state of the game.
 * @returns {string[]} - An array of possible target squares (in algebraic notation, e.g., ['e5', 'e6']).
 */
export const calculatePossibleMoves = (
  piece: string,
  fromSquare: string,
  board: string[][],
  fen: string
): string[] => {
  const possibleMoves: string[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((targetPiece, colIndex) => {
      const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
      const rank = 8 - rowIndex;
      const square = `${file}${rank}`;
      if (
        !sameType(piece, targetPiece) &&
        isMoveLegal(piece, square, fromSquare, board, fen)
      ) {
        possibleMoves.push(square);
      }
    });
  });

  return possibleMoves;
};
