
import { useCallback } from 'react';
import { Template } from "@/types/template";

export const useCanvasDimensions = () => {
  const calculateCanvasDimensions = useCallback((
    canvasContainerRef: React.RefObject<HTMLDivElement>, 
    activeTemplate: Template | undefined
  ) => {
    if (!canvasContainerRef.current) {
      return { width: 800, height: 1131 };
    }

    const containerWidth = canvasContainerRef.current.clientWidth - 48;
    const maxWidth = Math.min(containerWidth, 1200);
    
    let width, height;
    
    if (activeTemplate?.orientation === 'landscape') {
      width = maxWidth;
      height = Math.round(maxWidth / 1.414);
    } else {
      width = maxWidth;
      height = Math.round(maxWidth * 1.414);
    }
    
    return { width, height };
  }, []);

  return { calculateCanvasDimensions };
};
