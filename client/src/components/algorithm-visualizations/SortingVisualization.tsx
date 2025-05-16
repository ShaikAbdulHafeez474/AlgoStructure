import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { drawSortingArray } from '@/lib/canvas-utils';

const SortingVisualization = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentStep } = useAlgorithm();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => containerRef.current!);

  // Initialize dimensions on mount
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth || 500,
        height: containerRef.current.clientHeight || 300
      });
      setIsInitialized(true);
    }
  }, []);

  // Draw a placeholder sorting visualization
  const drawPlaceholderArray = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensions;
    const barCount = 10;
    const maxBarHeight = height - 100;
    const barWidth = Math.min(40, (width - 80) / barCount);
    const barSpacing = 8;
    const startX = (width - (barCount * (barWidth + barSpacing) - barSpacing)) / 2;
    
    // Generate random but consistent heights
    const heights = [70, 30, 90, 50, 80, 20, 60, 40, 85, 55];
    
    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const barHeight = (heights[i] / 100) * maxBarHeight;
      const x = startX + i * (barWidth + barSpacing);
      const y = height - 50 - barHeight;
      
      ctx.beginPath();
      ctx.rect(x, y, barWidth, barHeight);
      ctx.fillStyle = '#3f51b5';
      ctx.fill();
      
      // Add value
      ctx.fillStyle = '#212121';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(heights[i].toString(), x + barWidth / 2, y - 10);
    }
    
    // Add instruction text
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click the "Sort" button to visualize the sorting algorithm', width / 2, height - 15);
  };

  // Draw sorting visualization when currentStep or dimensions change
  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return;

    const canvas = canvasRef.current;
    
    // Set canvas dimensions
    canvas.width = Math.max(dimensions.width, 300);
    canvas.height = Math.max(dimensions.height, 300);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      if (currentStep) {
        // Draw sorting array based on current step
        drawSortingArray(ctx, currentStep.state);
        setError(null);
      } else {
        // Draw placeholder array
        drawPlaceholderArray(ctx);
      }
    } catch (err) {
      console.error("Error drawing sorting array:", err);
      setError("Error rendering sorting algorithm visualization");
      
      // Fallback rendering
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.fillText('Error rendering sorting algorithm visualization', canvas.width / 2, canvas.height / 2);
    }
  }, [currentStep, dimensions, isInitialized]);

  // Add resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0] && entries[0].contentRect) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
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
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '300px' }}>
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
          <p className="text-red-500 text-center px-4">{error}</p>
        </div>
      )}
    </div>
  );
});

SortingVisualization.displayName = 'SortingVisualization';

export default SortingVisualization;
