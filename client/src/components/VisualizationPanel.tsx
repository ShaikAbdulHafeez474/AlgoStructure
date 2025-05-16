import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';
import TreeVisualization from './algorithm-visualizations/TreeVisualization';
import GraphVisualization from './algorithm-visualizations/GraphVisualization';
import DPVisualization from './algorithm-visualizations/DPVisualization';
import SortingVisualization from './algorithm-visualizations/SortingVisualization';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { Input } from '@/components/ui/input';
import { AlgorithmCategory, AlgorithmOperation } from '@shared/schema';

interface OperationButtonProps {
  label: string;
  operation: AlgorithmOperation;
  onClick: (operation: AlgorithmOperation) => void;
}

const OperationButton: React.FC<OperationButtonProps> = ({ label, operation, onClick }) => (
  <Button 
    variant="default"
    className="px-3 py-1 text-white rounded hover:opacity-90 transition-colors" 
    onClick={() => onClick(operation)}
  >
    {label}
  </Button>
);

const VisualizationPanel: React.FC = () => {
  const { 
    currentAlgorithm,
    currentStep,
    performOperation,
    resetVisualization,
    operationValue,
    setOperationValue
  } = useAlgorithm();
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadVisualization = () => {
    if (!canvasRef.current) return;
    
    // Implementation would create an image from the canvas and trigger download
    console.log('Download visualization');
  };

  // Function to determine which visualization component to render
  const renderVisualizationComponent = () => {
    if (!currentAlgorithm) {
      return (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-gray-500 text-lg">Select an algorithm from the sidebar to begin</p>
        </div>
      );
    }

    const category = currentAlgorithm.category as AlgorithmCategory;
    switch (category) {
      case 'tree':
        return <TreeVisualization ref={canvasRef} />;
      case 'graph':
        return <GraphVisualization ref={canvasRef} />;
      case 'dp':
        return <DPVisualization ref={canvasRef} />;
      case 'sorting':
        return <SortingVisualization ref={canvasRef} />;
      default:
        return (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-gray-500">Visualization not available for this algorithm type</p>
          </div>
        );
    }
  };

  // Operation buttons for the current algorithm
  const renderOperationButtons = () => {
    if (!currentAlgorithm) return null;

    const category = currentAlgorithm.category as AlgorithmCategory;
    switch (category) {
      case 'tree':
        return (
          <div className="flex flex-wrap gap-2">
            <OperationButton label="Insert" operation="insert" onClick={performOperation} />
            <OperationButton label="Delete" operation="delete" onClick={performOperation} />
            <OperationButton label="Search" operation="search" onClick={performOperation} />
          </div>
        );
      case 'graph':
        return (
          <div className="flex flex-wrap gap-2">
            <OperationButton label="Add Node" operation="addNode" onClick={performOperation} />
            <OperationButton label="Add Edge" operation="addEdge" onClick={performOperation} />
            <OperationButton label="Find Path" operation="findPath" onClick={performOperation} />
          </div>
        );
      case 'dp':
        return (
          <div className="flex flex-wrap gap-2">
            <OperationButton label="Calculate" operation="calculate" onClick={performOperation} />
            <OperationButton label="Optimize" operation="optimize" onClick={performOperation} />
          </div>
        );
      case 'sorting':
        return (
          <div className="flex flex-wrap gap-2">
            <OperationButton label="Sort" operation="sort" onClick={performOperation} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Operation Controls */}
      {currentAlgorithm && (
        <div className="mb-4 flex flex-wrap items-center justify-between bg-gray-50 p-3 rounded-md">
          <div className="flex flex-wrap gap-2">
            {renderOperationButtons()}
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium">Value:</label>
            <Input 
              type="number"
              className="w-16 px-2 py-1 text-center"
              min={1}
              max={100}
              value={operationValue}
              onChange={(e) => setOperationValue(parseInt(e.target.value || "1", 10))}
            />
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-grow relative rounded-md overflow-hidden bg-gray-50 border border-gray-200">
        {/* Action buttons */}
        {currentAlgorithm && (
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <Button 
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full bg-white" 
              title="Download visualization"
              onClick={downloadVisualization}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="w-8 h-8 p-0 rounded-full bg-white" 
              title="Reset visualization"
              onClick={resetVisualization}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Visualization component */}
        <div className="h-full w-full">
          {renderVisualizationComponent()}
        </div>
        
        {/* Step information */}
        {currentStep && (
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2 text-center text-sm">
            {currentStep.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;
