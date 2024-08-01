import React, { useContext, useState } from 'react';
import { Chess } from 'chess.js';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';
import Piece from '../Piece';
import '../ChessBoard/styles.css';

interface PromotionPawnProps {
  piece: 'P' | 'p';
  square: string;
  game: Chess;
  prevSquarePromotion: string;
}

type PieceType = 'Q' | 'N' | 'R' | 'B' | 'b' | 'r' | 'n' | 'q';

const PromotionPawn: React.FC<PromotionPawnProps> = ({
  piece,
  square,
  game,
  prevSquarePromotion,
}) => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const [selectedPiece, setSelectedPiece] = useState<PieceType | null>(null);

  const handleTouchStart = (pieceType: PieceType) => {
    setSelectedPiece(pieceType);
  };

  const handleTouchEnd = (pieceType: PieceType) => {
    if (selectedPiece === pieceType) {
      setTimeout(() => {
        handlePieceClick(pieceType);
      }, 0);
    }
    setSelectedPiece(null);
  };

  const handlePieceClick = (selectedPiece: PieceType) => {
    game.move({
      from: prevSquarePromotion,
      to: square,
      promotion: selectedPiece.toLowerCase(),
    });
    context?.setLastMove({
      from: prevSquarePromotion,
      to: square,
    });
    context.setFEN(game.fen());
    context.setCurrentTurn(context.currentTurn === 'white' ? 'black' : 'white');
    context.setNotation(game.pgn());
    context.setPromotionModal(false);
    context.setPrevToPromotionMove({ from: '', to: '' });
  };

  return (
    <>
      {piece === 'P' ? (
        <div className="flex flex-col square-promote z-20 bg-white">
          {['Q', 'N', 'R', 'B'].map((pieceType) => (
            <div
              key={pieceType}
              className={`bg-circle-promotion-pawn ${
                context.isTouchDevice && selectedPiece === pieceType
                  ? 'bg-orange-400'
                  : ''
              } ${!context.isTouchDevice ? 'hover:bg-orange-400' : ''}`}
              onTouchStart={() =>
                context.isTouchDevice &&
                handleTouchStart(pieceType as PieceType)
              }
              onTouchEnd={() =>
                context.isTouchDevice && handleTouchEnd(pieceType as PieceType)
              }
              onClick={() =>
                !context.isTouchDevice &&
                handlePieceClick(pieceType as PieceType)
              }
            >
              <Piece piece={pieceType as PieceType} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col square-promote z-20 bg-white">
          {['b', 'r', 'n', 'q'].map((pieceType) => (
            <div
              key={pieceType}
              className={`bg-circle-promotion-pawn ${
                context.isTouchDevice && selectedPiece === pieceType
                  ? 'bg-orange-400'
                  : ''
              } ${!context.isTouchDevice ? 'hover:bg-orange-400' : ''}`}
              onTouchStart={() =>
                context.isTouchDevice &&
                handleTouchStart(pieceType as PieceType)
              }
              onTouchEnd={() =>
                context.isTouchDevice && handleTouchEnd(pieceType as PieceType)
              }
              onClick={() =>
                !context.isTouchDevice &&
                handlePieceClick(pieceType as PieceType)
              }
            >
              <Piece piece={pieceType as PieceType} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PromotionPawn;
