import React from 'react';
import AlgorithmSidebar from '@/components/AlgorithmSidebar';
import VisualizationPanel from '@/components/VisualizationPanel';
import CodePanel from '@/components/CodePanel';
import ControlPanel from '@/components/ControlPanel';
import { useAlgorithm } from '@/hooks/useAlgorithm';

const Home: React.FC = () => {
  const { currentAlgorithm } = useAlgorithm();
  
  return (
    <div className="container mx-auto px-4 py-6 h-full flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/4 xl:w-1/5">
        <AlgorithmSidebar />
      </div>
      
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Main content area */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0">
          {/* Left column - Visualization area */}
          <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-3 flex flex-col h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {currentAlgorithm ? `Visualization: ${currentAlgorithm.name}` : 'Select an algorithm'}
              </h3>
            </div>
            
            <div className="flex-grow bg-white border border-gray-200 rounded relative">
              <VisualizationPanel />
            </div>
          </div>
          
          {/* Right column - Code panel */}
          <div className="lg:col-span-2 flex flex-col h-[500px]">
            <CodePanel />
          </div>
        </div>
        
        {/* Controls at the bottom */}
        <div className="mt-4">
          <ControlPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
