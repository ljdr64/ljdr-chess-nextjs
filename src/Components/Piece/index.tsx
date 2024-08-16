import Image from 'next/image';
import React from 'react';
import '../ChessBoard/styles.css';

interface PieceProps {
  piece: string; // La pieza es una cadena, puede ser 'k', 'q', 'r', etc.
  onClick?: () => void; // La función onClick es opcional y no toma argumentos
}

// Función para determinar el ID del símbolo basado en la pieza recibida
const getSymbolId = (piece: string): string | null => {
  const normalizedPiece = piece.toLowerCase(); // Convertir a minúscula para asegurar la comparación
  if (
    normalizedPiece === 'k' ||
    normalizedPiece === 'q' ||
    normalizedPiece === 'r' ||
    normalizedPiece === 'b' ||
    normalizedPiece === 'n' ||
    normalizedPiece === 'p'
  ) {
    return piece === piece.toLowerCase()
      ? `Chess_${normalizedPiece}dt45`
      : `Chess_${normalizedPiece}lt45`; // Letra minúscula (d) o mayúscula (l)
  }
  return null; // Devuelve null si no se encuentra un ID válido
};

const Piece: React.FC<PieceProps> = React.memo(({ piece, onClick }) => {
  const symbolId = getSymbolId(piece);

  // Si no se encuentra un ID válido, se devuelve null
  if (!symbolId) {
    return null;
  }

  // Construir la ruta relativa al SVG
  const svgUrl = `/assets/svg/pieces/${symbolId}.svg`;

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none"
      onClick={onClick}
    >
      <Image
        src={svgUrl}
        alt={`Chess piece ${piece}`}
        width={64}
        height={64}
        className="dim-piece"
      />
    </div>
  );
});

Piece.displayName = 'Piece';

export default Piece;
