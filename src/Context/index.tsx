'use client';

import { FENToBoard2DArray } from '../utils';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface ChessBoardContextType {
  setFEN: React.Dispatch<React.SetStateAction<string>>;
  fen: string;
  setBoard2DArray: React.Dispatch<React.SetStateAction<string[][]>>;
  board2DArray: string[][];
  setBoardPrevToPromotion: React.Dispatch<React.SetStateAction<string[][]>>;
  boardPrevToPromotion: string[][];
  setCurrentTurn: React.Dispatch<React.SetStateAction<string>>;
  currentTurn: string;
  setOnPromote: React.Dispatch<React.SetStateAction<string | null>>;
  onPromote: string | null;
  setNotation: React.Dispatch<React.SetStateAction<string>>;
  notation: string;
  setPromotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  promotionModal: boolean;
  setPromotionNotation: React.Dispatch<React.SetStateAction<string>>;
  promotionNotation: string;
  handlePromote: any;
  setLastFEN: React.Dispatch<React.SetStateAction<string>>;
  lastFEN: string;
  setIsClockZero: React.Dispatch<React.SetStateAction<boolean>>;
  isClockZero: boolean;
  setIsTouchDevice: React.Dispatch<React.SetStateAction<boolean>>;
  isTouchDevice: boolean;
  setChessResult: React.Dispatch<React.SetStateAction<string>>;
  chessResult: string;
  setLastMove: React.Dispatch<
    React.SetStateAction<{ from: string; to: string }>
  >;
  lastMove: { from: string; to: string };
  setPrevToPromotionMove: React.Dispatch<
    React.SetStateAction<{ from: string; to: string }>
  >;
  prevToPromotionMove: { from: string; to: string };
}

export const ChessBoardContext = createContext<
  ChessBoardContextType | undefined
>(undefined);

export const ChessBoardProvider: React.FC<{
  children: ReactNode;
  initialFEN: string;
}> = ({ children, initialFEN }) => {
  const [fen, setFEN] = useState(initialFEN);
  const [board2DArray, setBoard2DArray] = useState(
    FENToBoard2DArray(initialFEN)
  );
  const [boardPrevToPromotion, setBoardPrevToPromotion] = useState(
    FENToBoard2DArray(initialFEN)
  );
  const [lastFEN, setLastFEN] = useState('');
  const [lastMove, setLastMove] = useState({ from: '', to: '' });
  const [prevToPromotionMove, setPrevToPromotionMove] = useState({
    from: '',
    to: '',
  });
  const [currentTurn, setCurrentTurn] = useState('white');
  const [onPromote, setOnPromote] = useState<string | null>(null);
  const [notation, setNotation] = useState('');
  const [promotionModal, setPromotionModal] = useState(false);
  const [promotionNotation, setPromotionNotation] = useState('');
  const [isClockZero, setIsClockZero] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [chessResult, setChessResult] = useState('');

  useEffect(() => {
    setBoard2DArray(FENToBoard2DArray(fen));
  }, [fen]);

  useEffect(() => {
    const detectTouchDevice = () => {
      const hasTouchScreen =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouchScreen);
    };

    detectTouchDevice();
  }, []);

  const handlePromote = (
    from: string,
    to: string,
    piece: string,
    board: string[][]
  ) => {
    setBoardPrevToPromotion(board);
    const newBoard = board.map((row) => [...row]);
    newBoard[8 - parseInt(to[1])][to.charCodeAt(0) - 'a'.charCodeAt(0)] = piece;
    newBoard[8 - parseInt(from[1])][from.charCodeAt(0) - 'a'.charCodeAt(0)] =
      'empty';
    setBoard2DArray(newBoard);
    return;
  };

  return (
    <ChessBoardContext.Provider
      value={{
        setFEN,
        fen,
        setBoard2DArray,
        board2DArray,
        setBoardPrevToPromotion,
        boardPrevToPromotion,
        setCurrentTurn,
        currentTurn,
        setOnPromote,
        onPromote,
        setNotation,
        notation,
        setPromotionModal,
        promotionModal,
        setPromotionNotation,
        promotionNotation,
        handlePromote,
        setLastFEN,
        lastFEN,
        setIsClockZero,
        isClockZero,
        setIsTouchDevice,
        isTouchDevice,
        setChessResult,
        chessResult,
        setLastMove,
        lastMove,
        setPrevToPromotionMove,
        prevToPromotionMove,
      }}
    >
      {children}
    </ChessBoardContext.Provider>
  );
};
