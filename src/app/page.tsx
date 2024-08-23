'use client';

import { ChessBoardProvider } from '@/Context';
import ChessGame from '../Components/ChessGame';

export default function Page() {
  return (
    <div>
      <ChessBoardProvider>
        <ChessGame initialTime={1 * 60 * 1000} boardId="board1" />
      </ChessBoardProvider>

      <ChessBoardProvider>
        <ChessGame initialTime={3 * 60 * 1000} boardId="board2" />
      </ChessBoardProvider>
    </div>
  );
}
