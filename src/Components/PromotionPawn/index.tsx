import React, { useContext, useState } from 'react';
import { ChessBoardContext } from '../../Context';
import Piece from '../Piece';
import '../ChessBoard/styles.css';

const PromotionPawn = ({ piece, square }) => {
  const context = useContext(ChessBoardContext);
  const [selectedPiece, setSelectedPiece] = useState(null);

  const handleTouchStart = (pieceType) => {
    setSelectedPiece(pieceType);
  };

  const handleTouchEnd = (pieceType) => {
    if (selectedPiece === pieceType) {
      setTimeout(() => {
        handlePieceClick(pieceType);
      }, 0);
    }
    setSelectedPiece(null);
  };

  const handlePieceClick = (selectedPiece) => {
    context.handlePromote(selectedPiece, square);
    context.setCurrentTurn(context.currentTurn === 'white' ? 'black' : 'white');
    context.setNotation(
      (prev) =>
        prev + context.promotionNotation + '=' + selectedPiece.toUpperCase()
    );
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
              }  ${!context.isTouchDevice ? 'hover:bg-orange-400' : ''}`}
              onTouchStart={() =>
                context.isTouchDevice && handleTouchStart(pieceType)
              }
              onTouchEnd={() =>
                context.isTouchDevice && handleTouchEnd(pieceType)
              }
              onClick={() =>
                !context.isTouchDevice && handlePieceClick(pieceType)
              }
            >
              <Piece piece={pieceType} />
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
                context.isTouchDevice && handleTouchStart(pieceType)
              }
              onTouchEnd={() =>
                context.isTouchDevice && handleTouchEnd(pieceType)
              }
              onClick={() =>
                !context.isTouchDevice && handlePieceClick(pieceType)
              }
            >
              <Piece piece={pieceType} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PromotionPawn;
