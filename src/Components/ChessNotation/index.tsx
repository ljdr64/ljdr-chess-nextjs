'use client';

import { useContext, useEffect, useRef } from 'react';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';
import '../ChessBoard/styles.css';

const ChessNotation = () => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const notationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }
  }, [context?.notation]);

  return (
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
  );
};

export default ChessNotation;
