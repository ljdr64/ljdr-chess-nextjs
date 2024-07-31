import { useEffect, useState } from 'react';

export const useSquareSize = () => {
  const [squareSize, setSquareSize] = useState(64);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const size = getComputedStyle(
          document.documentElement
        ).getPropertyValue('--dim-square');
        setSquareSize(parseInt(size, 10));
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return squareSize;
};
