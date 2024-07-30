/**
 * Validates a FEN string.
 * @param {string} fen - The FEN string to validate.
 * @returns {boolean} - Returns true if the FEN string is valid, otherwise false.
 */
export const validateFEN = (fen: string): boolean => {
  // Split the FEN string into its components
  const fenParts: string[] = fen.split(' ');

  // The FEN string must have exactly 6 parts
  if (fenParts.length !== 6) {
    return false;
  }

  const [position, turn, castling, enPassant, halfmoveClock, fullmoveNumber]: [
    string,
    string,
    string,
    string,
    string,
    string
  ] = fenParts;

  // Validate the position part
  const rows: string[] = position.split('/');
  if (rows.length !== 8) {
    return false;
  }

  const validPieces: string = 'prnbqkPRNBQK';
  for (const row of rows) {
    let count: number = 0;
    for (const char of row) {
      if (validPieces.includes(char)) {
        count += 1;
      } else if (!isNaN(Number(char))) {
        count += parseInt(char, 10);
      } else {
        return false;
      }
    }
    if (count !== 8) {
      return false;
    }
  }

  // Validate the turn (must be 'w' or 'b')
  if (turn !== 'w' && turn !== 'b') {
    return false;
  }

  // Validate castling rights (can be a combination of 'KQkq' or '-')
  if (!/^(-|[KQkq]{1,4})$/.test(castling)) {
    return false;
  }

  // Validate en passant (can be '-' or a valid position like 'a3', 'h6')
  if (!/^(-|[a-h][36])$/.test(enPassant)) {
    return false;
  }

  // Validate halfmove clock (must be a non-negative integer)
  if (isNaN(Number(halfmoveClock)) || parseInt(halfmoveClock, 10) < 0) {
    return false;
  }

  // Validate fullmove number (must be an integer greater than or equal to 1)
  if (isNaN(Number(fullmoveNumber)) || parseInt(fullmoveNumber, 10) < 1) {
    return false;
  }

  return true;
};
