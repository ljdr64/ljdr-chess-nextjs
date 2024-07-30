'use client';

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../../KingInCheck';
import { calculatePossibleMoves } from '../../utils/calculatePossibleMoves';
import { isDrawFen } from '../../utils/isDrawFen';
import '../ChessBoard/styles.css';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const notationRef = useRef(null);
  const [possiblesMoves, setPossiblesMoves] = useState({
    white: [],
    black: [],
  });

  useMemo(() => {
    const updatedPossiblesMoves = { white: [], black: [] };

    context?.board2DArray.forEach((row, rowIndex) => {
      row.forEach((targetPiece, colIndex) => {
        if (targetPiece !== 'empty') {
          const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
          const rank = 8 - rowIndex;
          const square = `${file}${rank}`;
          if (targetPiece === targetPiece.toUpperCase()) {
            updatedPossiblesMoves.white.push(
              ...calculatePossibleMoves(
                targetPiece,
                square,
                context?.board2DArray,
                context?.fen
              )
            );
          }
          if (targetPiece === targetPiece.toLowerCase()) {
            updatedPossiblesMoves.black.push(
              ...calculatePossibleMoves(
                targetPiece,
                square,
                context?.board2DArray,
                context?.fen
              )
            );
          }
        }
      });
    });

    setPossiblesMoves(updatedPossiblesMoves);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.fen]);

  useEffect(() => {
    const updateNotation = () => {
      const isBlackKingCheck = isBlackKingInCheck(context?.board2DArray);
      const isWhiteKingCheck = isWhiteKingInCheck(context?.board2DArray);

      const isBlackCheckmate =
        isBlackKingCheck && possiblesMoves.black.length === 0;
      const isWhiteCheckmate =
        isWhiteKingCheck && possiblesMoves.white.length === 0;

      const isBlackStalemate =
        !isBlackKingCheck && possiblesMoves.black.length === 0;
      const isWhiteStalemate =
        !isWhiteKingCheck && possiblesMoves.white.length === 0;

      let newNotation = context?.notation;

      if (context?.fullmoveNumber > 1) {
        if (
          (isWhiteStalemate &&
            context?.currentTurn === 'white' &&
            !context?.promotionModal) ||
          (isBlackStalemate &&
            context?.currentTurn === 'black' &&
            !context?.promotionModal) ||
          isDrawFen(context?.fen) ||
          context?.halfmoveNumber === 100
        ) {
          context?.setChessResult('1/2-1/2');
        }
      }

      if (
        (isBlackCheckmate || isWhiteCheckmate) &&
        !context?.notation.endsWith('#') &&
        !context?.promotionModal
      ) {
        if (isBlackCheckmate) {
          context?.setChessResult('1-0');
        } else if (isWhiteCheckmate) {
          context?.setChessResult('0-1');
        }
        newNotation += '#';
      } else if (
        (isBlackKingCheck || isWhiteKingCheck) &&
        !context?.notation.endsWith('+') &&
        !context?.notation.endsWith('#') &&
        !context?.promotionModal
      ) {
        newNotation += '+';
      }

      context?.setNotation(newNotation);
    };

    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }

    updateNotation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [possiblesMoves]);

  return (
    <>
      <div
        ref={notationRef}
        className="w-full h-[83px] lg:w-60 lg:h-[var(--dim-board)] flex flex-col bg-white overflow-y-scroll"
      >
        {context?.notation.split('.').map((line, index) => {
          const moves = line.split(' ');
          const moveNumber = index;
          const whiteMove = moves.length > 1 ? moves[1] : '';
          const blackMove = moves.length > 2 ? moves[2] : '';

          return (
            whiteMove &&
            moveNumber > 0 && (
              <div
                key={index}
                className="flex justify-between border-t border-x border-gray-600 shadow-lg p-2 last:border-b"
              >
                <pre className="w-10">{moveNumber}</pre>
                <pre className="w-20">{whiteMove}</pre>
                <pre className="w-20">{blackMove}</pre>
              </div>
            )
          );
        })}
        {context?.chessResult !== '' && (
          <div className="flex border border-black justify-center">
            {context?.chessResult}
          </div>
        )}
      </div>
    </>
  );
};

export default ChessNotation;
