import { getRookMoves } from '../ChessMoves/rookMoves';
import { getBishopMoves } from '../ChessMoves/bishopMoves';
import { getKnightMoves } from '../ChessMoves/knightMoves';
import { getQueenMoves } from '../ChessMoves/queenMoves';
import { getKingMoves } from '../ChessMoves/kingMoves';

/**
 * Generates a chess square notation (e.g., 'a1', 'h8') from given rank and file indices.
 * @param {integer} rank - The rank index (0-7) representing the row of the chessboard.
 * @param {integer} file - The file index (0-7) representing the column of the chessboard.
 * @returns {string} - Returns the chess square notation (e.g., 'a1', 'h8') based on the provided rank and file indices.
 */
const getSquareAtRankFile = (rank: number, file: number): string => {
  const fileChar = String.fromCharCode('a'.charCodeAt(0) + file);
  const rankNum = 8 - rank;
  const square = `${fileChar}${rankNum}`;
  return square;
};

/**
 * Function to check if the white king is in check in a given board state.
 * @param {string[][]} boardState - The current state of the chess board represented as a 2D array.
 * @returns {boolean} - Returns true if the white king is in check, otherwise false.
 */
export function isWhiteKingInCheck(boardState: string[][]): boolean {
  let kingPositionSquare = 'e1';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState?.[i][j] === 'K') {
        if (i > 0 && j < 7 && boardState[i - 1][j + 1] === 'p') {
          return true;
        }
        if (i > 0 && j > 0 && boardState[i - 1][j - 1] === 'p') {
          return true;
        }
        kingPositionSquare = getSquareAtRankFile(i, j);
        break;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      switch (boardState?.[i][j]) {
        case 'r':
          if (
            getRookMoves(
              'r',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'b':
          if (
            getBishopMoves(
              'b',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'n':
          if (
            getKnightMoves(
              'n',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'q':
          if (
            getQueenMoves(
              'q',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'k':
          if (
            getKingMoves(
              'k',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
      }
    }
  }

  return false;
}

/**
 * Function to check if the black king is in check in a given board state.
 * @param {string[][]} boardState - The current state of the chess board represented as a 2D array.
 * @returns {boolean} - Returns true if the black king is in check, otherwise false.
 */
export function isBlackKingInCheck(boardState: string[][]): boolean {
  let kingPositionSquare = 'e8';

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState?.[i][j] === 'k') {
        if (i < 7 && j < 7 && boardState[i + 1][j + 1] === 'P') {
          return true;
        }
        if (i < 7 && j > 0 && boardState[i + 1][j - 1] === 'P') {
          return true;
        }
        kingPositionSquare = getSquareAtRankFile(i, j);
        break;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      switch (boardState?.[i][j]) {
        case 'R':
          if (
            getRookMoves(
              'R',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'B':
          if (
            getBishopMoves(
              'B',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'N':
          if (
            getKnightMoves(
              'N',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'Q':
          if (
            getQueenMoves(
              'Q',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
        case 'K':
          if (
            getKingMoves(
              'K',
              kingPositionSquare,
              getSquareAtRankFile(i, j),
              boardState
            )
          ) {
            return true;
          }
          break;
      }
    }
  }

  return false;
}
