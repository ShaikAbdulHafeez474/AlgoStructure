import { AlgorithmState } from '@shared/schema';

// Constants for visualization
const NODE_RADIUS = 30;
const FONT_SIZE = 16;
const LINE_WIDTH = 2;
const DEFAULT_COLOR = '#3f51b5';
const HIGHLIGHT_COLOR = '#ff4081';
const LINE_COLOR = '#757575';
const HIGHLIGHT_LINE_COLOR = '#ff4081';
const TEXT_COLOR = 'white';

/**
 * Draw a tree visualization on canvas
 */
export function drawTree(ctx: CanvasRenderingContext2D, state: AlgorithmState): void {
  const { nodes, edges } = state;
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw edges first so they appear behind nodes
  if (edges) {
    edges.forEach(edge => {
      const source = nodes.find(node => node.id === edge.source);
      const target = nodes.find(node => node.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = edge.highlighted ? HIGHLIGHT_LINE_COLOR : LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
      }
    });
  }
  
  // Draw nodes
  if (nodes) {
    nodes.forEach(node => {
      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = node.highlighted ? HIGHLIGHT_COLOR : (node.color || DEFAULT_COLOR);
      ctx.fill();
      ctx.strokeStyle = node.highlighted ? HIGHLIGHT_LINE_COLOR : '#303f9f';
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `${FONT_SIZE}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.value), node.x, node.y);
      
      // Draw highlight animation if node is highlighted
      if (node.highlighted) {
        drawNodeHighlight(ctx, node.x, node.y);
      }
    });
  }
  
  // Draw any message or step information
  if (state.message) {
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, ctx.canvas.width / 2, 30);
  }
}

/**
 * Draw a graph visualization on canvas
 */
export function drawGraph(ctx: CanvasRenderingContext2D, state: AlgorithmState): void {
  const { nodes, edges } = state;
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw edges first
  if (edges) {
    edges.forEach(edge => {
      const source = nodes.find(node => node.id === edge.source);
      const target = nodes.find(node => node.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = edge.highlighted ? HIGHLIGHT_LINE_COLOR : LINE_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.stroke();
        
        // If edge has a value (weight), draw it
        if (edge.value !== undefined) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          
          ctx.fillStyle = '#212121';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Draw a small white background for better readability
          const textWidth = ctx.measureText(String(edge.value)).width;
          ctx.fillStyle = 'white';
          ctx.fillRect(midX - textWidth / 2 - 2, midY - 8, textWidth + 4, 16);
          
          ctx.fillStyle = '#212121';
          ctx.fillText(String(edge.value), midX, midY);
        }
      }
    });
  }
  
  // Draw nodes
  if (nodes) {
    nodes.forEach(node => {
      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = node.highlighted ? HIGHLIGHT_COLOR : (node.color || DEFAULT_COLOR);
      ctx.fill();
      ctx.strokeStyle = node.highlighted ? HIGHLIGHT_LINE_COLOR : '#303f9f';
      ctx.lineWidth = LINE_WIDTH;
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = `${FONT_SIZE}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.value), node.x, node.y);
      
      // Draw highlight animation if node is highlighted
      if (node.highlighted) {
        drawNodeHighlight(ctx, node.x, node.y);
      }
    });
  }
  
  // Draw any message or step information
  if (state.message) {
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, ctx.canvas.width / 2, 30);
  }
}

/**
 * Draw a dynamic programming table visualization
 */
export function drawDPTable(ctx: CanvasRenderingContext2D, state: AlgorithmState): void {
  const { nodes, auxData } = state;
  const cellSize = 50;
  const startX = (ctx.canvas.width - (nodes.length * cellSize)) / 2;
  const startY = 100;
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw table header if available
  if (auxData && auxData.headers) {
    const headers = auxData.headers as string[];
    
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    headers.forEach((header, i) => {
      ctx.fillText(header, startX + i * cellSize + cellSize / 2, startY - 25);
    });
  }
  
  // Draw cells and values
  if (nodes) {
    nodes.forEach(node => {
      const x = node.x || startX + parseInt(node.id.split('-')[1]) * cellSize;
      const y = node.y || startY;
      
      // Draw cell rectangle
      ctx.beginPath();
      ctx.rect(x, y, cellSize, cellSize);
      ctx.fillStyle = node.highlighted ? HIGHLIGHT_COLOR : 'white';
      ctx.fill();
      ctx.strokeStyle = '#303f9f';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw value
      ctx.fillStyle = node.highlighted ? 'white' : '#212121';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.value), x + cellSize / 2, y + cellSize / 2);
    });
  }
  
  // Draw any message or step information
  if (state.message) {
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, ctx.canvas.width / 2, 50);
  }
}

/**
 * Draw a sorting array visualization
 */
export function drawSortingArray(ctx: CanvasRenderingContext2D, state: AlgorithmState): void {
  const { nodes } = state;
  
  // Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Calculate bar width based on canvas width and number of elements
  const maxBarHeight = ctx.canvas.height - 100;
  const barWidth = Math.min(50, (ctx.canvas.width - 80) / (nodes.length || 1));
  const barSpacing = 5;
  
  // Draw bars
  if (nodes) {
    nodes.forEach((node, index) => {
      const x = 40 + index * (barWidth + barSpacing);
      // Calculate height proportional to value
      const barHeight = (parseInt(String(node.value)) / 100) * maxBarHeight;
      const y = ctx.canvas.height - 50 - barHeight;
      
      // Draw bar
      ctx.beginPath();
      ctx.rect(x, y, barWidth, barHeight);
      ctx.fillStyle = node.highlighted ? HIGHLIGHT_COLOR : DEFAULT_COLOR;
      ctx.fill();
      
      // Draw value on top of bar
      ctx.fillStyle = '#212121';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(node.value), x + barWidth / 2, y - 5);
    });
  }
  
  // Draw any message or step information
  if (state.message) {
    ctx.fillStyle = '#212121';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, ctx.canvas.width / 2, 30);
  }
}

/**
 * Draw a highlight animation around a node
 */
function drawNodeHighlight(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  // Save current state
  ctx.save();
  
  // Create pulsing effect
  const time = new Date().getTime() % 1500 / 1500;
  const scale = 1 + 0.2 * Math.sin(time * Math.PI * 2);
  const radius = NODE_RADIUS * scale;
  
  // Draw outer circle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = HIGHLIGHT_COLOR;
  ctx.lineWidth = 2;
  
  // Create dashed line effect
  ctx.setLineDash([6, 3]);
  ctx.globalAlpha = 0.6 + 0.4 * Math.sin(time * Math.PI * 2);
  
  ctx.stroke();
  
  // Restore state
  ctx.restore();
}
