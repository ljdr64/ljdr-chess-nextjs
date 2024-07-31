'use client';

import React, {
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';
import { useSquareSize } from '../../Hooks/useSquareSize';
import Piece from '../Piece';
import PromotionPawn from '../PromotionPawn';
import { isMoveLegal } from '../../ChessMoves';
import { formatNotation } from '../../utils/formatNotation';
import { calculatePossibleMoves } from '../../utils/calculatePossibleMoves';
import { sameType } from '../../utils/sameType';
import { isBlackKingInCheck, isWhiteKingInCheck } from '../../KingInCheck';
import './styles.css';

type SquareRefs = {
  [key: string]: RefObject<HTMLDivElement>;
};

type PieceType = 'empty' | string;
type SquareType = string;

interface Position {
  x: number;
  y: number;
}

const ChessBoard = () => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [draggingPiece, setDraggingPiece] = useState<PieceType>('empty');
  const [currentSquare, setCurrentSquare] = useState<SquareType>('');
  const [dragStartSquare, setDragStartSquare] = useState<SquareType>('');
  const [highlightedSquare, setHighlightedSquare] = useState<SquareType>('');
  const [highlightedLastMove, setHighlightedLastMove] =
    useState<SquareType>('');
  const [possibleMoves, setPossibleMoves] = useState<SquareType[]>([]);
  const squareSize = useSquareSize();
  let squarePieceDrop = ['', 'empty'];

  const squareRefs = useMemo<SquareRefs>(() => {
    const refs: SquareRefs = {};
    for (
      let rowIndex = 0;
      rowIndex < context?.board2DArray.length;
      rowIndex++
    ) {
      const row = context?.board2DArray[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        refs[square] = React.createRef<HTMLDivElement>();
      }
    }
    return refs;
  }, [context?.board2DArray]);

  const pieceRefs = useMemo(() => {
    const refs: SquareRefs = {};
    for (
      let rowIndex = 0;
      rowIndex < context?.board2DArray.length;
      rowIndex++
    ) {
      const row = context?.board2DArray[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        refs[square] = React.createRef<HTMLDivElement>();
      }
    }
    return refs;
  }, [context?.board2DArray]);

  useEffect(() => {
    if (isDragging && !context?.isClockZero) {
      document.addEventListener('mousemove', handleMouseMove as EventListener, {
        passive: false,
      });
      document.addEventListener('touchmove', handleTouchMove as EventListener, {
        passive: false,
      });
    } else {
      document.removeEventListener(
        'mousemove',
        handleMouseMove as EventListener
      );
      document.removeEventListener(
        'touchmove',
        handleTouchMove as EventListener
      );
    }

    return () => {
      document.removeEventListener(
        'mousemove',
        handleMouseMove as EventListener
      );
      document.removeEventListener(
        'touchmove',
        handleTouchMove as EventListener
      );
    };
  }, [isDragging, context?.isClockZero]);

  useEffect(() => {
    if (context?.isClockZero) {
      setPosition({ x: 0, y: 0 });
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
    }
  }, [context?.isClockZero]);

  const handleMouseClick = (square: SquareType): void => {
    if (draggingPiece === 'empty' || context?.isClockZero) return;

    if (
      square !== currentSquare &&
      isMoveLegal(
        draggingPiece,
        square,
        currentSquare,
        context?.board2DArray,
        context?.fen
      )
    ) {
      if (
        (draggingPiece === 'P' && square?.[1] === '8') ||
        (draggingPiece === 'p' && square?.[1] === '1')
      ) {
        context?.setPromotionModal(true);
        context?.setPromotionNotation(
          formatNotation(
            draggingPiece,
            currentSquare,
            'empty',
            square,
            context?.fullmoveNumber,
            context?.board2DArray,
            context?.fen
          )
        );
      } else {
        context?.setCurrentTurn(
          context.currentTurn === 'white' ? 'black' : 'white'
        );
        context?.setNotation(
          (prev) =>
            prev +
            formatNotation(
              draggingPiece,
              currentSquare,
              'empty',
              square,
              context?.fullmoveNumber,
              context?.board2DArray,
              context?.fen
            )
        );
      }
      context?.handlePieceMove(currentSquare, square);
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
    }
  };

  const handleMouseDown = (
    e: MouseEvent | Touch,
    square: SquareType,
    piece: PieceType
  ): void => {
    if (context?.isClockZero) {
      return;
    }

    if (context?.chessResult !== '') {
      return;
    }

    if (possibleMoves.some((item) => item === square)) {
      if (
        (draggingPiece === 'P' && square?.[1] === '8') ||
        (draggingPiece === 'p' && square?.[1] === '1')
      ) {
        context?.setPromotionModal(true);
        context?.setPromotionNotation(
          formatNotation(
            draggingPiece,
            currentSquare,
            piece,
            square,
            context?.fullmoveNumber,
            context?.board2DArray,
            context?.fen
          )
        );
      } else {
        context?.setCurrentTurn(
          context.currentTurn === 'white' ? 'black' : 'white'
        );
        context?.setNotation(
          (prev) =>
            prev +
            formatNotation(
              draggingPiece,
              currentSquare,
              piece,
              square,
              context?.fullmoveNumber,
              context?.board2DArray,
              context?.fen
            )
        );
      }
      context?.handlePieceMove(currentSquare, square);
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
      return;
    } else if (
      piece === 'empty' ||
      (context.currentTurn === 'white' && piece === piece.toLowerCase()) ||
      (context.currentTurn === 'black' && piece === piece.toUpperCase())
    ) {
      setDraggingPiece('empty');
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
      return;
    }

    if (
      (piece === 'P' && square?.[1] === '8') ||
      (piece === 'p' && square?.[1] === '1')
    ) {
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
      return;
    }

    setDragStartSquare(square);
    const moves = calculatePossibleMoves(
      piece,
      square,
      context?.board2DArray,
      context?.fen
    );
    setPossibleMoves(moves);

    const pieceMove = document.getElementById(square);
    if (pieceMove) {
      const offsetX =
        e.clientX - pieceMove.getBoundingClientRect().left - squareSize / 2;
      const offsetY =
        e.clientY - pieceMove.getBoundingClientRect().top - squareSize / 2;
      setPosition({ x: offsetX, y: offsetY });
      setIsDragging(true);
    }
    setDraggingPiece(piece);
    setCurrentSquare(square);
    setHighlightedSquare('');
  };

  const handleMouseMove = (e: MouseEvent | Touch): void => {
    const pieceArea = pieceRefs[currentSquare].current;
    if (pieceArea === null) {
      return;
    }
    const piecePos = {
      posX: pieceArea.offsetLeft + squareSize / 2,
      posY: pieceArea.offsetTop + squareSize / 2,
    };

    const moves = calculatePossibleMoves(
      draggingPiece,
      currentSquare,
      context?.board2DArray,
      context?.fen
    );
    moves.push(currentSquare);

    const squareArea: { [key: string]: HTMLElement | null } = {};
    const squarePos: { [key: string]: { posX: number; posY: number } } = {};

    for (const item of moves) {
      squareArea[item] = squareRefs[item].current;
      if (squareArea[item]) {
        squarePos[item] = {
          posX: squareArea[item].offsetLeft,
          posY: squareArea[item].offsetTop,
        };
      }
      if (!context?.isTouchDevice) {
        if (
          e.clientX - squarePos[item].posX + window.scrollX <= squareSize - 1 &&
          e.clientY - squarePos[item].posY + window.scrollY <= squareSize - 1 &&
          e.clientX - squarePos[item].posX + window.scrollX >= 0 &&
          e.clientY - squarePos[item].posY + window.scrollY >= 0
        ) {
          if (
            item === context?.lastMove.from ||
            item === context?.lastMove.to
          ) {
            setHighlightedLastMove(item);
            setHighlightedSquare('');
            break;
          } else {
            setHighlightedSquare(item);
            setHighlightedLastMove('');
            break;
          }
        } else {
          setHighlightedSquare('');
          setHighlightedLastMove('');
        }
      }
    }

    if (isDragging) {
      let newX = e.clientX - piecePos.posX + window.scrollX;
      let newY = e.clientY - piecePos.posY + window.scrollY;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = (): void => {
    if (context?.isClockZero) {
      return;
    }

    if (!isDragging) return;

    const squareArea: { [key: string]: HTMLElement | null } = {};
    const squarePos: { [key: string]: { posX: number; posY: number } } = {};

    const pieceArea = pieceRefs[currentSquare].current;
    if (pieceArea === null) {
      return;
    }
    const piecePos = {
      posX: pieceArea.offsetLeft,
      posY: pieceArea.offsetTop,
    };

    context?.board2DArray.forEach((row, rowIndex) =>
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;
        squareArea[square] = squareRefs[square].current;
        if (squareArea[square]) {
          squarePos[square] = {
            posX: squareArea[square].offsetLeft,
            posY: squareArea[square].offsetTop,
          };
        }
      })
    );

    let positionFound = false;
    context?.board2DArray.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
        const rank = 8 - rowIndex;
        const square = `${file}${rank}`;

        if (
          position.y >=
            squarePos[square].posY - piecePos.posY - squareSize / 2 &&
          position.y <=
            squarePos[square].posY - piecePos.posY + squareSize / 2 - 1 &&
          position.x >=
            squarePos[square].posX - piecePos.posX - squareSize / 2 &&
          position.x <=
            squarePos[square].posX - piecePos.posX + squareSize / 2 - 1
        ) {
          squarePieceDrop = [square, piece];
          positionFound = true;
          if (
            !sameType(draggingPiece, squarePieceDrop[1]) &&
            isMoveLegal(
              draggingPiece,
              squarePieceDrop[0],
              currentSquare,
              context?.board2DArray,
              context?.fen
            )
          ) {
            if (
              (draggingPiece === 'P' && squarePieceDrop[0]?.[1] === '8') ||
              (draggingPiece === 'p' && squarePieceDrop[0]?.[1] === '1')
            ) {
              context?.setPromotionModal(true);
              context?.setPromotionNotation(
                formatNotation(
                  draggingPiece,
                  currentSquare,
                  piece,
                  squarePieceDrop[0],
                  context?.fullmoveNumber,
                  context?.board2DArray,
                  context?.fen
                )
              );
            } else {
              context?.setCurrentTurn(
                context.currentTurn === 'white' ? 'black' : 'white'
              );
              context?.setNotation(
                (prev) =>
                  prev +
                  formatNotation(
                    draggingPiece,
                    currentSquare,
                    piece,
                    squarePieceDrop[0],
                    context?.fullmoveNumber,
                    context?.board2DArray,
                    context?.fen
                  )
              );
            }
            context?.handlePieceMove(currentSquare, squarePieceDrop[0]);
            setPosition({
              x: squarePos[square].posX - piecePos.posX,
              y: squarePos[square].posY - piecePos.posY,
            });
            setDragStartSquare('');
            setHighlightedSquare('');
            setPossibleMoves([]);
          } else {
            setPosition({ x: 0, y: 0 });
            squarePieceDrop = ['', 'empty'];
          }
        }
      });
    });

    if (!positionFound) {
      setPosition({ x: 0, y: 0 });
      squarePieceDrop = ['', 'empty'];
    }

    setIsDragging(false);
  };

  const handleTouchStart = (
    e: TouchEvent,
    square: SquareType,
    piece: PieceType
  ): void => {
    const event = e.touches[0];
    handleMouseDown(event, square, piece);
  };

  const handleTouchMove = (e: TouchEvent): void => {
    const event = e.touches[0];
    handleMouseMove(event);
  };

  const handleTouchEnd = (): void => {
    handleMouseUp();
  };

  const getSquareClass = (
    isLightSquare: boolean,
    isHighlighted: boolean,
    isHighlightedLastMove: boolean,
    isDragStartSquare: boolean,
    isPossibleMove: boolean,
    isPossibleTake: boolean,
    isWhiteInCheck: boolean,
    isBlackInCheck: boolean,
    isPromotedWhitePawn: boolean,
    isPromotedBlackPawn: boolean,
    isLastMoveSquare: boolean
  ) => {
    let baseClass = isLightSquare ? 'light-square' : 'dark-square';

    if (isLastMoveSquare) {
      baseClass = isLightSquare ? 'bg-blue-300' : 'bg-blue-400';
    }

    if (isHighlightedLastMove) {
      return baseClass;
    }

    if (isPromotedWhitePawn || isPromotedBlackPawn) {
      return `${baseClass} bg-blue-500`;
    }

    if (isWhiteInCheck || isBlackInCheck) {
      return `${baseClass} bg-circle-check`;
    }

    if (isHighlighted || isDragStartSquare) {
      return `bg-green-700`;
    }

    if (isPossibleMove) {
      return `${baseClass} ${
        isPossibleTake ? 'bg-circle-take-piece' : 'bg-circle-in-center'
      } ${isLastMoveSquare ? 'hover:bg-none' : 'hover:bg-green-700'}`;
    }

    return baseClass;
  };

  return (
    <div className="board-container mx-auto select-none">
      {context?.promotionModal && (
        <div className="flex absolute dim-board bg-gray-500 opacity-50 z-10"></div>
      )}
      <div className="flex flex-wrap dim-board touch-none cursor-pointer select-none">
        {context?.board2DArray.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const file = String.fromCharCode('a'.charCodeAt(0) + colIndex);
            const rank = 8 - rowIndex;
            const square = `${file}${rank}`;
            const isLightSquare = (colIndex + rowIndex) % 2 === 0;
            const isHighlighted = highlightedSquare === square;
            const isHighlightedLastMove = highlightedLastMove === square;
            const isPossibleMove = possibleMoves.some(
              (item) => item === square
            );
            const isPossibleTake = isPossibleMove && piece !== 'empty';
            const isWhiteInCheck =
              piece === 'K' &&
              isWhiteKingInCheck(context?.board2DArray) &&
              !context?.promotionModal;
            const isBlackInCheck =
              piece === 'k' &&
              isBlackKingInCheck(context?.board2DArray) &&
              !context?.promotionModal;
            const isPromotedWhitePawn = piece === 'P' && rank === 8;
            const isPromotedBlackPawn = piece === 'p' && rank === 1;
            const isDragStartSquare = dragStartSquare === square;
            const isLastMoveSquare =
              square === context?.lastMove.to ||
              square === context?.lastMove.from;

            const squareClass = getSquareClass(
              isLightSquare,
              isHighlighted,
              isHighlightedLastMove,
              isDragStartSquare,
              isPossibleMove,
              isPossibleTake,
              isWhiteInCheck,
              isBlackInCheck,
              isPromotedWhitePawn,
              isPromotedBlackPawn,
              isLastMoveSquare
            );

            return (
              <div
                key={square}
                ref={squareRefs[square]}
                className={`dim-square flex items-center justify-center cursor-pointer ${squareClass}`}
                onMouseDown={(e) => handleMouseDown(e, square, piece)}
                onTouchStart={(e) => handleTouchStart(e, square, piece)}
                onClick={() => handleMouseClick(square)}
              >
                {currentSquare === square ? (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card dim-square cursor-pointer"
                      style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                      }}
                      onMouseUp={handleMouseUp}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div id={square} className="h-full pointer-events-none">
                        {piece !== 'empty' && <Piece piece={piece} />}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn piece={piece} square={square} />
                      </div>
                    )}
                    <div
                      ref={pieceRefs[square]}
                      className="card dim-square cursor-pointer"
                    >
                      <div id={square} className="h-full pointer-events-none">
                        {piece !== 'empty' && <Piece piece={piece} />}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
