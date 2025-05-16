import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { drawTree } from '@/lib/canvas-utils';

const TreeVisualization = forwardRef<HTMLDivElement, {}>((props, ref) => {
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

  // Create a simple tree visualization if no currentStep
  const drawPlaceholderTree = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = 80;
    const radius = 25;
    const levelHeight = 100;
    
    // Root
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3f51b5';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#303f9f';
    ctx.stroke();
    
    // Root value
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('50', centerX, centerY);
    
    // Left child
    ctx.beginPath();
    ctx.arc(centerX - 120, centerY + levelHeight, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3f51b5';
    ctx.fill();
    ctx.stroke();
    
    // Left child value
    ctx.fillStyle = 'white';
    ctx.fillText('25', centerX - 120, centerY + levelHeight);
    
    // Right child
    ctx.beginPath();
    ctx.arc(centerX + 120, centerY + levelHeight, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3f51b5';
    ctx.fill();
    ctx.stroke();
    
    // Right child value
    ctx.fillStyle = 'white';
    ctx.fillText('75', centerX + 120, centerY + levelHeight);
    
    // Left grandchild
    ctx.beginPath();
    ctx.arc(centerX - 170, centerY + levelHeight * 2, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3f51b5';
    ctx.fill();
    ctx.stroke();
    
    // Left grandchild value
    ctx.fillStyle = 'white';
    ctx.fillText('10', centerX - 170, centerY + levelHeight * 2);
    
    // Connect nodes with lines
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + radius); // From root
    ctx.lineTo(centerX - 120, centerY + levelHeight - radius); // To left child
    ctx.moveTo(centerX, centerY + radius); // From root
    ctx.lineTo(centerX + 120, centerY + levelHeight - radius); // To right child
    ctx.moveTo(centerX - 120, centerY + levelHeight + radius); // From left child
    ctx.lineTo(centerX - 170, centerY + levelHeight * 2 - radius); // To left grandchild
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#757575';
    ctx.stroke();
    
    // Add instructions
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Select an operation and enter a value to manipulate the tree', centerX, height - 20);
  };

  // Draw tree based on current step or a placeholder
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
        // Draw tree based on current step
        drawTree(ctx, currentStep.state);
        setError(null);
      } else {
        // Draw placeholder tree
        drawPlaceholderTree(ctx);
      }
    } catch (err) {
      console.error("Error drawing tree:", err);
      setError("Error rendering tree visualization");
      
      // Fallback rendering
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ff0000';
      ctx.textAlign = 'center';
      ctx.fillText('Error rendering tree visualization', canvas.width / 2, canvas.height / 2);
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

TreeVisualization.displayName = 'TreeVisualization';

export default TreeVisualization;
