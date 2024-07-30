import '../ChessBoard/styles.css';
import React from 'react';

interface PieceProps {
  piece: string; // La pieza es una cadena, puede ser 'k', 'q', 'r', etc.
  onClick?: () => void; // La función onClick es opcional y no toma argumentos
}

const Piece: React.FC<PieceProps> = ({ piece, onClick }) => {
  // Función para determinar el ID del símbolo basado en la pieza recibida
  const getSymbolId = (piece: string): string | null => {
    const normalizedPiece = piece.toLowerCase(); // Convertir a minúscula para asegurar la comparación
    if (
      piece === 'k' ||
      piece === 'q' ||
      piece === 'r' ||
      piece === 'b' ||
      piece === 'n' ||
      piece === 'p'
    ) {
      return `Chess_${normalizedPiece}dt45`; // Letra minúscula (d)
    } else if (
      piece === 'K' ||
      piece === 'Q' ||
      piece === 'R' ||
      piece === 'B' ||
      piece === 'N' ||
      piece === 'P'
    ) {
      return `Chess_${normalizedPiece}lt45`; // Letra mayúscula (l)
    } else {
      return null; // Devuelve null si no se encuentra un ID válido
    }
  };

  const symbolId = getSymbolId(piece);

  // Si no se encuentra un ID válido, se devuelve null
  if (!symbolId) {
    return null;
  }

  // Construir la ruta relativa al SVG
  const svgUrl = `/assets/svg/${symbolId}.svg`;

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      onClick={onClick}
    >
      <img src={svgUrl} alt={`Chess piece ${piece}`} className="dim-piece" />
    </div>
  );
};

export default Piece;
