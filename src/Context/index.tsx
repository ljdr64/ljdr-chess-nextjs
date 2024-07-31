'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  FENToBoard2DArray,
  board2DArrayToFEN,
  updateBoard2DArrayPosition,
  promotionPieceInBoard2DArray,
} from '../utils';
import { validateFEN } from '../utils/validateFen';

export interface ChessBoardContextType {
  setFEN: React.Dispatch<React.SetStateAction<string>>;
  fen: string;
  board2DArray: string[][];
  handlePieceMove: (fromPosition: string, toPosition: string) => void;
  setCurrentTurn: React.Dispatch<React.SetStateAction<string>>;
  currentTurn: string;
  handlePromote: (piece: string, square: string) => void;
  setOnPromote: React.Dispatch<React.SetStateAction<string | null>>;
  onPromote: string | null;
  fullmoveNumber: number;
  setHalfmoveNumber: React.Dispatch<React.SetStateAction<number>>;
  halfmoveNumber: number;
  setNotation: React.Dispatch<React.SetStateAction<string>>;
  notation: string;
  setPromotionModal: React.Dispatch<React.SetStateAction<boolean>>;
  promotionModal: boolean;
  setPromotionNotation: React.Dispatch<React.SetStateAction<string>>;
  promotionNotation: string;
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

// Inicializa el contexto con un valor vacío
export const ChessBoardContext = createContext<
  ChessBoardContextType | undefined
>(undefined);

export const ChessBoardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [fen, setFEN] = useState(initialFEN);
  const [lastFEN, setLastFEN] = useState('');
  const [lastMove, setLastMove] = useState({ from: '', to: '' });
  const [prevToPromotionMove, setPrevToPromotionMove] = useState({
    from: '',
    to: '',
  });
  const [currentTurn, setCurrentTurn] = useState('white');
  const [fullmoveNumber, setFullmoveNumber] = useState(1);
  const [halfmoveNumber, setHalfmoveNumber] = useState(0);
  const [onPromote, setOnPromote] = useState<string | null>(null);
  const [notation, setNotation] = useState('');
  const [promotionModal, setPromotionModal] = useState(false);
  const [promotionNotation, setPromotionNotation] = useState('');
  const [isClockZero, setIsClockZero] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [chessResult, setChessResult] = useState('');

  useEffect(() => {
    const detectTouchDevice = () => {
      const hasTouchScreen =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouchScreen);
    };

    detectTouchDevice();
  }, []);

  const board2DArray = FENToBoard2DArray(fen);

  const handlePromote = (piece: string, square: string) => {
    setOnPromote(piece);
    const newFEN = board2DArrayToFEN(
      promotionPieceInBoard2DArray(board2DArray, square, piece),
      currentTurn,
      fullmoveNumber,
      0,
      updateCastlingAvailability(fen, square),
      '-'
    );

    if (validateFEN(newFEN)) {
      setLastFEN(fen);
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
    }
  };

  const updateCastlingAvailability = (
    currentFEN: string,
    fromPosition: string
  ) => {
    const fenParts = currentFEN.split(' ');
    let newCastlingAvailability = fenParts[2];

    if (fromPosition === 'a8') {
      newCastlingAvailability = newCastlingAvailability.replace('q', '');
    } else if (fromPosition === 'h8') {
      newCastlingAvailability = newCastlingAvailability.replace('k', '');
    } else if (fromPosition === 'a1') {
      newCastlingAvailability = newCastlingAvailability.replace('Q', '');
    } else if (fromPosition === 'h1') {
      newCastlingAvailability = newCastlingAvailability.replace('K', '');
    } else if (fromPosition === 'e1') {
      newCastlingAvailability = newCastlingAvailability.replace('K', '');
      newCastlingAvailability = newCastlingAvailability.replace('Q', '');
    } else if (fromPosition === 'e8') {
      newCastlingAvailability = newCastlingAvailability.replace('k', '');
      newCastlingAvailability = newCastlingAvailability.replace('q', '');
    }

    if (newCastlingAvailability === '') {
      newCastlingAvailability = '-';
    }

    return newCastlingAvailability;
  };

  const getEnPassantSquare = (
    piece: string,
    fromPosition: string,
    toPosition: string
  ) => {
    if (piece === 'P') {
      if (fromPosition[1] === '2' && toPosition[1] === '4') {
        const enPassantSquare = toPosition[0] + '3';
        return enPassantSquare;
      }
    }
    if (piece === 'p') {
      if (fromPosition[1] === '7' && toPosition[1] === '5') {
        const enPassantSquare = toPosition[0] + '6';
        return enPassantSquare;
      }
    }
    return '-';
  };

  const handlePieceMove = (fromPosition: string, toPosition: string) => {
    setLastMove({ from: fromPosition, to: toPosition });

    const [newBoard2DArray, piece] = updateBoard2DArrayPosition(
      board2DArray,
      fromPosition,
      toPosition
    );

    if (
      (piece === 'P' && toPosition[1] === '8') ||
      (piece === 'p' && toPosition[1] === '1')
    ) {
      setPrevToPromotionMove({ from: lastMove.from, to: lastMove.to });
    }

    let updatedFullmoveNumber = fullmoveNumber;

    if (currentTurn === 'black') {
      updatedFullmoveNumber++;
    }

    setFullmoveNumber(updatedFullmoveNumber);

    const toFile = toPosition[0];
    const toRank = parseInt(toPosition[1], 10);

    const isPawnMove = piece.toLowerCase() === 'p';
    const isCapture =
      board2DArray[8 - toRank][toFile.charCodeAt(0) - 'a'.charCodeAt(0)] !==
      'empty';

    let updatedHalfmoveNumber = halfmoveNumber;

    if (isPawnMove || isCapture) {
      updatedHalfmoveNumber = 0;
    } else {
      updatedHalfmoveNumber++;
    }

    setHalfmoveNumber(updatedHalfmoveNumber);

    const newFEN = board2DArrayToFEN(
      newBoard2DArray,
      currentTurn,
      updatedFullmoveNumber,
      updatedHalfmoveNumber,
      updateCastlingAvailability(fen, fromPosition),
      getEnPassantSquare(piece, fromPosition, toPosition)
    );

    if (validateFEN(newFEN)) {
      setLastFEN(fen);
      setFEN(newFEN);
    } else {
      console.error('invalid FEN: ', newFEN);
    }
  };

  return (
    <ChessBoardContext.Provider
      value={{
        setFEN,
        fen,
        board2DArray,
        handlePieceMove,
        setCurrentTurn,
        currentTurn,
        handlePromote,
        setOnPromote,
        onPromote,
        fullmoveNumber,
        setHalfmoveNumber,
        halfmoveNumber,
        setNotation,
        notation,
        setPromotionModal,
        promotionModal,
        setPromotionNotation,
        promotionNotation,
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
