'use client';

import { useContext, useEffect, useRef } from 'react';
import { ChessBoardContext, ChessBoardContextType } from '@/Context';
import Layout from '../Layout';
import ChessClock from '../ChessClock';
import ChessBoard from '../ChessBoard';
import ChessNotation from '../ChessNotation';
import '../ChessBoard/styles.css';

interface ChessGameProps {
  initialTime?: number;
  boardId: string;
}

function ChessGame({ initialTime = 1 * 60 * 1000, boardId }: ChessGameProps) {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const notationRef = useRef<HTMLPreElement>(null);
  const cleanedNotation = context?.notation?.replace(/\n/g, '').trim();

  useEffect(() => {
    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }
  }, [context?.notation]);

  return (
    <Layout>
      <div className="justify-center mt-4 mb-4">
        <div className="flex lg:flex-row flex-col w-[var(--dim-board)] sm:w-[var(--dim-board-padding)] lg:w-full">
          <div className="bg-gray-200 sm:px-[var(--dim-padding)] rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold px-4 sm:px-0">player02</div>
              <ChessClock initialTime={initialTime} turn="black" />
            </div>
            <ChessBoard boardId={boardId} />
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold px-4 sm:px-0">player01</div>
              <ChessClock initialTime={initialTime} turn="white" />
            </div>
          </div>
          <div className="hidden lg:block bg-gray-200 notation-padding rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className="lg:block bg-gray-200 lg:w-full max-w-[var(--dim-board)] sm:max-w-[var(--dim-board-padding)] chessgame-padding rounded-lg shadow-lg">
          <pre className="h-[var(--dim-square)] text-wrap border border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll">
            {context?.promotionModal ? context?.lastFEN : context?.fen}
          </pre>
          <pre
            ref={notationRef}
            className="text-wrap h-[var(--dim-square)] border-b border-x border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll"
          >
            {cleanedNotation || ' '}
            {' ' + context?.chessResult}
          </pre>
        </div>
      </div>
    </Layout>
  );
}

export default ChessGame;
