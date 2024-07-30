'use client';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';

const ChessClock = ({ initialTime, turn }) => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const intervalRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      if (context?.fullmoveNumber > 1 && context?.chessResult === '') {
        if (context?.currentTurn === 'white') {
          setWhiteTime((prev) => (prev > 0 ? prev - 100 : 0));
        } else {
          setBlackTime((prev) => (prev > 0 ? prev - 100 : 0));
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
        context?.setFEN(context?.lastFEN);
        context?.setLastMove(context?.prevToPromotionMove);
      }
    }
  }, [whiteTime, blackTime]);

  return (
    <div>
      <div>
        {turn === 'white' ? (
          <div
            className={`font-size-clock px-2 ${
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
            className={`font-size-clock px-2 ${
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

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenthsOfSecond = Math.floor((milliseconds % 1000) / 100);
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}${totalSeconds < 10 ? `.${tenthsOfSecond}` : ''}`;
};

export default ChessClock;
