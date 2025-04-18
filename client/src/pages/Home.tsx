import React from 'react';
import AlgorithmSidebar from '@/components/AlgorithmSidebar';
import VisualizationPanel from '@/components/VisualizationPanel';
import CodePanel from '@/components/CodePanel';
import ControlPanel from '@/components/ControlPanel';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 h-full flex flex-col lg:flex-row gap-6">
      <AlgorithmSidebar />
      
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        <VisualizationPanel />
        
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-0 mt-4">
          <div className="bg-surface rounded-lg shadow-md p-4 lg:col-span-3 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Visualization</h3>
            </div>
            <div id="visualization-container" className="flex-grow bg-white border border-gray-200 rounded relative">
              {/* Visualization components are rendered by VisualizationPanel */}
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col">
            <CodePanel />
          </div>
        </div>
        
        <ControlPanel />
      </div>
    </div>
  );
};

export default Home;
