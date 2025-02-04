'use client';

import React, {
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Chess } from 'chess.js';
import { ChessBoardContext, ChessBoardContextType } from '../../Context';
import { useSquareSize } from '../../Hooks/useSquareSize';
import Piece from '../Piece';
import PromotionPawn from '../PromotionPawn';
import './styles.css';
import { FENToBoard2DArray } from '@/utils';

type SquareRefs = {
  [key: string]: RefObject<HTMLDivElement>;
};

type PieceType = 'empty' | string;
type SquareType = string;

interface Position {
  x: number;
  y: number;
}

interface ChessBoardProps {
  boardId: string;
  game: Chess;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ boardId, game }) => {
  const context = useContext(ChessBoardContext) as ChessBoardContextType;
  const [possibleMoves, setPossibleMoves] = useState<SquareType[]>([]);
  const [prevSquarePromotion, setPrevSquarePromotion] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [movePosition, setMovePosition] = useState<Position>({ x: 0, y: 0 });
  const [draggingPiece, setDraggingPiece] = useState<PieceType>('empty');
  const [currentSquare, setCurrentSquare] = useState<SquareType>('');
  const [dragStartSquare, setDragStartSquare] = useState<SquareType>('');
  const [highlightedSquare, setHighlightedSquare] = useState<SquareType>('');
  const [highlightedLastMove, setHighlightedLastMove] =
    useState<SquareType>('');
  const squareSize = useSquareSize();
  const boardRef = useRef<HTMLDivElement>(null);

  const board = FENToBoard2DArray(context?.fen);

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

  const ghostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDragging && !context?.isClockZero) {
      document.addEventListener('mousemove', handleMouseMove as EventListener, {
        passive: false,
      });
      document.addEventListener('touchmove', handleTouchMove as EventListener, {
        passive: false,
      });
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
      setMovePosition({ x: 0, y: 0 });
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
    }
  }, [context?.isClockZero]);

  useEffect(() => {
    if (context?.isReset) {
      setMovePosition({ x: 0, y: 0 });
      setDragStartSquare('');
      setHighlightedSquare('');
      setPossibleMoves([]);
      context?.setIsReset(false);
      context?.setIsClockZero(false);
      if (ghostRef.current) {
        ghostRef.current.style.width = '0px';
        ghostRef.current.style.height = '0px';
        ghostRef.current.style.transform = 'translate(0px, 0px)';
        ghostRef.current.style.visibility = 'hidden';
      }
    }
  }, [context?.isReset]);

  const handleMouseDown = (
    e: any,
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
      context?.setLastFEN(context?.fen);
      context?.setPrevToLastMove(context?.lastMove);

      if (ghostRef.current) {
        ghostRef.current.style.width = '0px';
        ghostRef.current.style.height = '0px';
        ghostRef.current.style.transform = 'translate(0px, 0px)';
        ghostRef.current.style.visibility = 'hidden';
      }

      if (draggingPiece === 'K' && currentSquare === 'e1') {
        if (square === 'h1') {
          square = 'g1';
        }
        if (square === 'a1') {
          square = 'c1';
        }
      }
      if (draggingPiece === 'k' && currentSquare === 'e8') {
        if (square === 'h8') {
          square = 'g8';
        }
        if (square === 'a8') {
          square = 'c8';
        }
      }

      context?.setLastMove({ from: currentSquare, to: square });

      if (squareRefs[square]?.current && squareRefs[currentSquare]?.current) {
        const squareOffset = squareRefs[square].current;
        const currentOffset = squareRefs[currentSquare].current;
        if (squareOffset && currentOffset) {
          setMovePosition({
            x: squareOffset.offsetLeft - currentOffset.offsetLeft,
            y: squareOffset.offsetTop - currentOffset.offsetTop,
          });
        }
      }
      if (
        (draggingPiece === 'P' && square?.[1] === '8') ||
        (draggingPiece === 'p' && square?.[1] === '1')
      ) {
        context?.setPromotionModal(true);
        setPrevSquarePromotion(currentSquare);
        setTimeout(() => {
          context.handlePromote(currentSquare, square, draggingPiece, board);
        }, 190);
      } else {
        setTimeout(() => {
          setMovePosition({ x: 0, y: 0 });
          game.move({ from: currentSquare, to: square });
          context?.setCurrentTurn(game.turn() === 'w' ? 'white' : 'black');
          context?.setNotation(game.pgn());
          if (game.isCheckmate()) {
            if (game.turn() === 'b') {
              context?.setChessResult('1-0');
            } else if (game.turn() === 'w') {
              context?.setChessResult('0-1');
            }
          } else if (game.isStalemate() || game.isDraw()) {
            context?.setChessResult('1/2-1/2');
          }
          context?.setFEN(game.fen());
        }, 190);
      }
      setDraggingPiece('empty');
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
      setMovePosition({ x: 0, y: 0 });
      setIsDragging(false);
      return;
    }

    setDragStartSquare(square);

    const moves: string[] = game
      .moves({ verbose: true })
      .filter((move) => move.from === square)
      .map((move) => move.to);

    if (piece === 'K' && square === 'e1') {
      if (moves.some((item) => item === 'g1')) {
        moves.push('h1');
      }
      if (moves.some((item) => item === 'c1')) {
        moves.push('a1');
      }
    }

    if (piece === 'k' && square === 'e8') {
      if (moves.some((item) => item === 'g8')) {
        moves.push('h8');
      }
      if (moves.some((item) => item === 'c8')) {
        moves.push('a8');
      }
    }

    setPossibleMoves(moves);

    const pieceArea = pieceRefs[square].current;
    if (pieceArea === null) {
      return;
    }
    const piecePos = {
      posX: pieceArea.offsetLeft + squareSize / 2,
      posY: pieceArea.offsetTop + squareSize / 2,
    };

    if (pieceArea) {
      const offsetX =
        e.clientX - pieceArea.getBoundingClientRect().left - squareSize / 2;
      const offsetY =
        e.clientY - pieceArea.getBoundingClientRect().top - squareSize / 2;
      pieceArea.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

      if (ghostRef.current && squareRefs['a8'].current) {
        ghostRef.current.style.width = `${squareSize}px`;
        ghostRef.current.style.height = `${squareSize}px`;
        ghostRef.current.style.transform = `translate(${
          piecePos.posX - squareRefs['a8'].current.offsetLeft - squareSize / 2
        }px, ${
          piecePos.posY - squareRefs['a8'].current.offsetTop - squareSize / 2
        }px)`;
        ghostRef.current.style.visibility = 'visible';
      }

      setIsDragging(true);
    }
    setDraggingPiece(piece);
    setCurrentSquare(square);
    setHighlightedSquare('');
  };

  const handleMouseMove = (e: any): void => {
    const pieceArea = pieceRefs[currentSquare].current;
    if (pieceArea === null) {
      return;
    }
    const piecePos = {
      posX: pieceArea.offsetLeft + squareSize / 2,
      posY: pieceArea.offsetTop + squareSize / 2,
    };

    const moves: string[] = game
      .moves({ verbose: true })
      .filter((move) => move.from === currentSquare)
      .map((move) => move.to);

    if (draggingPiece === 'K' && currentSquare === 'e1') {
      if (moves.some((item) => item === 'g1')) {
        moves.push('h1');
      }
      if (moves.some((item) => item === 'c1')) {
        moves.push('a1');
      }
    }
    if (draggingPiece === 'k' && currentSquare === 'e8') {
      if (moves.some((item) => item === 'g8')) {
        moves.push('h8');
      }
      if (moves.some((item) => item === 'c8')) {
        moves.push('a8');
      }
    }

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
      pieceArea.style.transform = `translate(${newX}px, ${newY}px)`;
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

    const moves: string[] = game
      .moves({ verbose: true })
      .filter((move) => move.from === currentSquare)
      .map((move) => move.to);

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
        let square = `${file}${rank}`;
        const regex = /translate\((-?\d+(?:\.\d+)?)px, (-?\d+(?:\.\d+)?)px\)/;
        const position = pieceArea.style.transform.match(regex);

        if (position) {
          if (
            parseInt(position[2], 10) >=
              squarePos[square].posY - piecePos.posY - squareSize / 2 &&
            parseInt(position[2], 10) <=
              squarePos[square].posY - piecePos.posY + squareSize / 2 - 1 &&
            parseInt(position[1], 10) >=
              squarePos[square].posX - piecePos.posX - squareSize / 2 &&
            parseInt(position[1], 10) <=
              squarePos[square].posX - piecePos.posX + squareSize / 2 - 1
          ) {
            positionFound = true;
            if (draggingPiece === 'K' && currentSquare === 'e1') {
              if (square === 'h1') {
                square = 'g1';
              }
              if (square === 'a1') {
                square = 'c1';
              }
            }
            if (draggingPiece === 'k' && currentSquare === 'e8') {
              if (square === 'h8') {
                square = 'g8';
              }
              if (square === 'a8') {
                square = 'c8';
              }
            }
            if (moves.includes(square)) {
              context?.setLastFEN(context?.fen);
              context?.setPrevToLastMove(context?.lastMove);
              context?.setLastMove({
                from: currentSquare,
                to: square,
              });

              if (ghostRef.current) {
                ghostRef.current.style.width = '0px';
                ghostRef.current.style.height = '0px';
                ghostRef.current.style.transform = 'translate(0px, 0px)';
                ghostRef.current.style.visibility = 'hidden';
              }

              if (
                (draggingPiece === 'P' && square[1] === '8') ||
                (draggingPiece === 'p' && square[1] === '1')
              ) {
                context.handlePromote(
                  currentSquare,
                  square,
                  draggingPiece,
                  context?.board2DArray
                );
                setPrevSquarePromotion(currentSquare);
                context?.setPromotionModal(true);
              } else {
                game.move({ from: currentSquare, to: square });
                context?.setCurrentTurn(
                  game.turn() === 'w' ? 'white' : 'black'
                );
                context?.setNotation(game.pgn());
                if (game.isCheckmate()) {
                  if (game.turn() === 'b') {
                    context?.setChessResult('1-0');
                  } else if (game.turn() === 'w') {
                    context?.setChessResult('0-1');
                  }
                } else if (game.isStalemate() || game.isDraw()) {
                  context?.setChessResult('1/2-1/2');
                }
                context?.setFEN(game.fen());
              }
              pieceArea.style.transform = '';
              setDraggingPiece('empty');
              setDragStartSquare('');
              setHighlightedSquare('');
              setPossibleMoves([]);
            } else {
              pieceArea.style.transform = '';
              setMovePosition({ x: 0, y: 0 });
            }
          }
        }
      });
    });

    if (!positionFound) {
      pieceArea.style.transform = '';
      setMovePosition({ x: 0, y: 0 });
    }

    setIsDragging(false);
  };

  const handleTouchStart = (
    e: any,
    square: SquareType,
    piece: PieceType
  ): void => {
    const event = e.touches[0];
    handleMouseDown(event, square, piece);
  };

  const handleTouchMove = (e: any): void => {
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
    isLastMoveSquare: boolean
  ) => {
    let baseClass = '';

    if (isLastMoveSquare) {
      baseClass = isLightSquare ? 'bg-blue-300' : 'bg-blue-400';
    }

    if (isHighlightedLastMove) {
      return baseClass;
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
    <div ref={boardRef} className="bg-board">
      {context?.promotionModal && (
        <div className="flex absolute dim-board bg-gray-500 opacity-50 z-10"></div>
      )}
      <div className="flex flex-wrap dim-board touch-none cursor-pointer select-none">
        {board.map((row, rowIndex) =>
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
              (game.isCheck() || game.isCheckmate()) &&
              context.currentTurn === 'white';
            const isBlackInCheck =
              piece === 'k' &&
              (game.isCheck() || game.isCheckmate()) &&
              context.currentTurn === 'black';
            const isPromotedWhitePawn =
              piece === 'P' && rank === 8 && context.promotionModal;
            const isPromotedBlackPawn =
              piece === 'p' && rank === 1 && context.promotionModal;
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
              isLastMoveSquare
            );

            return (
              <div
                key={square}
                ref={squareRefs[square]}
                className={`dim-square flex items-center justify-center cursor-pointer ${squareClass}`}
                onMouseDown={(e) => handleMouseDown(e, square, piece)}
                onTouchStart={(e) => handleTouchStart(e, square, piece)}
              >
                {currentSquare === square ? (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn
                          piece={piece}
                          square={square}
                          game={game}
                          prevSquarePromotion={prevSquarePromotion}
                        />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn
                          piece={piece}
                          square={square}
                          game={game}
                          prevSquarePromotion={prevSquarePromotion}
                        />
                      </div>
                    )}
                    {movePosition.x === 0 && movePosition.y === 0 ? (
                      <div
                        ref={pieceRefs[square]}
                        className="card dim-square cursor-pointer z-10"
                        onMouseUp={handleMouseUp}
                        onTouchEnd={handleTouchEnd}
                      >
                        <div id={square} className="h-full pointer-events-none">
                          {piece !== 'empty' && <Piece piece={piece} />}
                        </div>
                      </div>
                    ) : (
                      <div
                        ref={pieceRefs[square]}
                        className="card dim-square cursor-pointer"
                        style={{
                          transform: `translate(${movePosition.x}px, ${movePosition.y}px)`,
                          transition: 'transform 0.2s ease-in-out',
                        }}
                        onMouseUp={handleMouseUp}
                        onTouchEnd={handleTouchEnd}
                      >
                        <div id={square} className="h-full pointer-events-none">
                          {piece !== 'empty' && <Piece piece={piece} />}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isPromotedWhitePawn && (
                      <div className="shadow-lg h-auto promote-white z-20">
                        <PromotionPawn
                          piece={piece}
                          square={square}
                          game={game}
                          prevSquarePromotion={prevSquarePromotion}
                        />
                      </div>
                    )}
                    {isPromotedBlackPawn && (
                      <div className="shadow-lg h-auto promote-black z-20">
                        <PromotionPawn
                          piece={piece}
                          square={square}
                          game={game}
                          prevSquarePromotion={prevSquarePromotion}
                        />
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
        <div
          ref={ghostRef}
          className="ghost-piece absolute cursor-pointer"
          style={{
            width: '0px',
            height: '0px',
            transform: 'translate(0px, 0px)',
            visibility: 'hidden',
          }}
        >
          <div className="pointer-events-none opacity-50">
            <Piece piece={draggingPiece} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
