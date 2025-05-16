import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { FaStepBackward, FaPlay, FaPause, FaStepForward } from 'react-icons/fa';
import { useAlgorithm } from '@/hooks/useAlgorithm';

const ControlPanel: React.FC = () => {
  const { 
    isPlaying, 
    togglePlay, 
    stepBackward, 
    stepForward, 
    speed, 
    setSpeed,
    currentAlgorithm,
    currentStep,
    totalSteps
  } = useAlgorithm();

  // Formats complexity to display O(n), O(log n), etc.
  const formatComplexity = (complexity: string) => {
    return complexity;
  };
  
  const hasValidStep = currentStep && totalSteps > 0;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              onClick={stepBackward}
              disabled={!currentStep || currentStep.state.step <= 1}
            >
              <FaStepBackward className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              onClick={togglePlay}
            >
              {isPlaying ? <FaPause className="h-5 w-5" /> : <FaPlay className="h-5 w-5" />}
            </Button>
            <Button 
              variant="outline"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
              onClick={stepForward}
              disabled={!currentStep || !totalSteps || currentStep.state.step >= totalSteps}
            >
              <FaStepForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-grow flex items-center">
            <span className="text-sm mr-3">Speed:</span>
            <Slider 
              min={1} 
              max={5} 
              step={1}
              value={[speed]} 
              onValueChange={(values) => setSpeed(values[0])}
              className="w-full max-w-xs accent-primary" 
            />
          </div>
          
          {currentAlgorithm && (
            <div className="flex flex-col">
              <div className="flex items-center text-sm">
                <span className="mr-2">Time Complexity:</span>
                <span className="font-mono">
                  {currentAlgorithm.complexity?.time 
                    ? formatComplexity(currentAlgorithm.complexity.time) 
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <span className="mr-2">Space Complexity:</span>
                <span className="font-mono">
                  {currentAlgorithm.complexity?.space 
                    ? formatComplexity(currentAlgorithm.complexity.space) 
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
