import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { drawSortingArray } from '@/lib/canvas-utils';

const SortingVisualization = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentStep } = useAlgorithm();

  useImperativeHandle(ref, () => containerRef.current!);

  useEffect(() => {
    if (!canvasRef.current || !currentStep) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!container) return;

    // Resize canvas to fit container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sorting array based on current step
    drawSortingArray(ctx, currentStep.state);
  }, [currentStep, containerRef.current?.clientWidth, containerRef.current?.clientHeight]);

  // Add resize observer to handle container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (!canvasRef.current || !containerRef.current) return;
      
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
      
      // Redraw when size changes
      if (currentStep) {
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        drawSortingArray(ctx, currentStep.state);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [currentStep]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
    </div>
  );
});

SortingVisualization.displayName = 'SortingVisualization';

export default SortingVisualization;
