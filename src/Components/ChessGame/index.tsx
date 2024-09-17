'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { FaSyncAlt } from 'react-icons/fa';
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
  const [game, setGame] = useState(new Chess());
  const notationRef = useRef<HTMLPreElement>(null);
  const cleanedNotation = context?.notation?.replace(/\n/g, '').trim();

  useEffect(() => {
    if (notationRef.current) {
      notationRef.current.scrollTop = notationRef.current.scrollHeight;
    }
  }, [context?.notation]);

  const handleReset = () => {
    const newGame = new Chess();
    context?.setFEN(newGame.fen());
    context?.setNotation('');
    context?.setChessResult('');
    context?.setCurrentTurn('white');
    context?.setPromotionModal(false);
    context?.setLastMove({ from: '', to: '' });
    context?.setIsReset(true);
    setGame(newGame);
  };

  return (
    <Layout>
      <div className="justify-center mt-4 mb-4">
        <div className="flex lg:flex-row flex-col w-[var(--dim-board)] sm:w-[var(--dim-board-padding)] lg:w-full">
          <div className="bg-gray-200 sm:px-[var(--dim-padding)] rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold px-4 sm:px-0">player02</div>
              <ChessClock initialTime={initialTime} turn="black" />
            </div>
            <ChessBoard boardId={boardId} game={game} />
            <div className="flex justify-between items-center select-none">
              <div className="font-semibold px-4 sm:px-0">player01</div>
              <ChessClock initialTime={initialTime} turn="white" />
            </div>
          </div>
          <div className="hidden lg:block bg-gray-200 notation-padding rounded-lg shadow-lg">
            <ChessNotation />
          </div>
        </div>
        <div className="lg:block bg-gray-200 lg:w-full max-w-[var(--dim-board)] sm:max-w-[var(--dim-board-padding)] px-[var(--dim-padding)] pb-[var(--dim-padding)] rounded-lg shadow-lg">
          <div className="leading-none">
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white p-1 rounded shadow hover:bg-blue-600"
            >
              <FaSyncAlt className="reset-button" />
            </button>
          </div>
          <pre className="h-[var(--dim-square)] text-wrap border border-gray-600 shadow-lg text-sm bg-white p-2 overflow-y-scroll">
            {game.fen()}
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
