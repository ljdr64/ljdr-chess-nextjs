/**
 * Checks if the FEN position represents a draw.
 * @param {string} fen - The FEN position to analyze.
 * @returns {boolean} true if it's a draw, false otherwise.
 */
export function isDrawFen(fen: string): boolean {
  const fenParts = fen.split(' ');
  const positionFEN = fenParts[0];

  const drawRegex = /^[kK\d/]*[bBnN]{0,1}[kK\d/]*$/;

  const isDraw = drawRegex.test(positionFEN);

  return isDraw;
}
