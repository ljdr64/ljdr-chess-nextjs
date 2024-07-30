/**
 * Check if two pieces are of the same type.
 *
 * @param {string} string1 - First piece identifier ('empty', 'P', 'p', 'N', etc.).
 * @param {string} string2 - Second piece identifier ('empty', 'P', 'p', 'N', etc.).
 * @returns {boolean} - True if both pieces are of the same type, false otherwise.
 */
export const sameType = (string1: string, string2: string): boolean => {
  return (
    string1 !== 'empty' &&
    string2 !== 'empty' &&
    (/[a-z]/.test(string1) === /[a-z]/.test(string2) ||
      /[A-Z]/.test(string1) === /[A-Z]/.test(string2))
  );
};
