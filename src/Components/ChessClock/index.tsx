'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';

const ChessClock = ({
  initialTime,
  turn,
}: {
  initialTime: number;
  turn: string;
}) => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | number>(0);
  const fullmoveNumber = parseInt(context?.fen.split(' ')[5], 10);

  useEffect(() => {
    const tick = () => {
      if (fullmoveNumber > 1 && context?.chessResult === '') {
        if (context?.currentTurn === 'white') {
          setWhiteTime((prev: number) => (prev > 0 ? prev - 100 : 0));
        } else {
          setBlackTime((prev: number) => (prev > 0 ? prev - 100 : 0));
        }
      }
    };

    if (whiteTime > 0 && blackTime > 0) {
      intervalRef.current = setInterval(tick, 100);
    }

    return () => clearInterval(intervalRef.current);
  }, [context?.currentTurn, whiteTime, blackTime]);

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      if (whiteTime === 0) {
        context?.setChessResult('0-1');
      } else {
        context?.setChessResult('1-0');
      }
      clearInterval(intervalRef.current);
      context?.setIsClockZero(true);
      if (context?.promotionModal) {
        context?.setPromotionModal(false);
        context?.setLastMove(context?.prevToLastMove);
        context?.setFEN(context?.lastFEN);
      }
    }
  }, [whiteTime, blackTime]);

  useEffect(() => {
    if (context?.fen === initialFEN) {
      setWhiteTime(initialTime);
      setBlackTime(initialTime);
    }
  }, [context?.fen]);

  return (
    <div>
      <div>
        {turn === 'white' ? (
          <div
            className={`px-2 ${
              whiteTime < 10000
                ? 'font-size-clock-ten-seconds'
                : 'font-size-clock'
            } ${
              whiteTime < 10000 && context?.currentTurn === 'white'
                ? 'bg-red-300'
                : context?.currentTurn === 'white'
                ? 'bg-white'
                : 'bg-gray-300'
            }`}
          >
            {formatTime(whiteTime)}
          </div>
        ) : turn === 'black' ? (
          <div
            className={`px-2 ${
              blackTime < 10000
                ? 'font-size-clock-ten-seconds'
                : 'font-size-clock'
            }
              ${
                blackTime < 10000 && context?.currentTurn === 'black'
                  ? 'bg-red-300'
                  : context?.currentTurn === 'black'
                  ? 'bg-white'
                  : 'bg-gray-300'
              }`}
          >
            {formatTime(blackTime)}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenthsOfSecond = Math.floor((milliseconds % 1000) / 100);
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}${totalSeconds < 10 ? `.${tenthsOfSecond}` : ''}`;
};

export default ChessClock;
