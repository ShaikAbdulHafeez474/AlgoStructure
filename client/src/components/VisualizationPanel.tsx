import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors" 
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
    if (!currentAlgorithm) return null;

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
        return <div className="flex-grow bg-white border border-gray-200 rounded relative"></div>;
    }
  };

  // Determine which operations are available for the current algorithm
  const renderOperations = () => {
    if (!currentAlgorithm) return null;

    const category = currentAlgorithm.category as AlgorithmCategory;
    switch (category) {
      case 'tree':
        return (
          <>
            <OperationButton label="Insert" operation="insert" onClick={performOperation} />
            <OperationButton label="Delete" operation="delete" onClick={performOperation} />
            <OperationButton label="Search" operation="search" onClick={performOperation} />
          </>
        );
      case 'graph':
        return (
          <>
            <OperationButton label="Add Node" operation="addNode" onClick={performOperation} />
            <OperationButton label="Add Edge" operation="addEdge" onClick={performOperation} />
            <OperationButton label="Find Path" operation="findPath" onClick={performOperation} />
          </>
        );
      case 'dp':
        return (
          <>
            <OperationButton label="Calculate" operation="calculate" onClick={performOperation} />
            <OperationButton label="Optimize" operation="optimize" onClick={performOperation} />
          </>
        );
      case 'sorting':
        return (
          <OperationButton label="Sort" operation="sort" onClick={performOperation} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-grow flex flex-col h-full overflow-hidden">
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">
            {currentAlgorithm?.name || 'Select an algorithm'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {renderOperations()}
            <div className="flex items-center ml-auto">
              <label className="mr-2 text-sm">Value:</label>
              <Input 
                type="number"
                className="w-16 px-2 py-1 border border-gray-300 rounded"
                min={1}
                max={100}
                value={operationValue}
                onChange={(e) => setOperationValue(parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-surface rounded-lg shadow-md p-4 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Visualization</h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              className="p-1 rounded hover:bg-background transition-colors" 
              title="Download as PNG"
              onClick={downloadVisualization}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="p-1 rounded hover:bg-background transition-colors" 
              title="Reset"
              onClick={resetVisualization}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow bg-white border border-gray-200 rounded relative">
          {renderVisualizationComponent()}
        </div>
      </div>
    </div>
  );
};

export default VisualizationPanel;
