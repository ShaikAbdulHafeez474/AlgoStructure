import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { drawDPTable } from '@/lib/canvas-utils';

const DPVisualization = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentStep } = useAlgorithm();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  useImperativeHandle(ref, () => containerRef.current!);

  // Initialize dimensions on mount
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
      setIsInitialized(true);
    }
  }, []);

  // Draw DP table when currentStep or dimensions change
  useEffect(() => {
    if (!canvasRef.current || !currentStep || !isInitialized) return;

    const canvas = canvasRef.current;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      // Draw DP table based on current step
      drawDPTable(ctx, currentStep.state);
    } catch (error) {
      console.error("Error drawing DP table:", error);
      // Fallback rendering if there's an error
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.fillText('Error rendering dynamic programming visualization', canvas.width / 2, canvas.height / 2);
    }
  }, [currentStep, dimensions, isInitialized]);

  // Add resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full" style={{ minHeight: '300px' }}>
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
});

DPVisualization.displayName = 'DPVisualization';

export default DPVisualization;
