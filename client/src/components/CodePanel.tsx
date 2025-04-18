import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { ImplementationLanguage } from '@shared/schema';

const CodePanel: React.FC = () => {
  const { currentAlgorithm, currentStep } = useAlgorithm();
  const [language, setLanguage] = useState<ImplementationLanguage>('cpp');

  const getCodeContent = () => {
    if (!currentAlgorithm || !currentStep) {
      return '// Select an algorithm to view the code implementation';
    }

    return currentStep.code.content;
  };

  const getHighlightedLines = () => {
    if (!currentStep) return [];
    return currentStep.code.highlightLines;
  };

  const renderCode = () => {
    const content = getCodeContent();
    const highlightedLines = getHighlightedLines();
    
    // Split code into lines to apply highlighting
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = highlightedLines.includes(lineNumber);
      
      return (
        <div 
          key={lineNumber} 
          className={`${isHighlighted ? 'highlighted-code-line' : ''}`}
        >
          {line}
        </div>
      );
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as ImplementationLanguage);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            {language === 'cpp' ? 'C++ Implementation' : 'JavaScript Implementation'}
          </h3>
          <div className="flex items-center">
            <Select defaultValue="cpp" onValueChange={handleLanguageChange}>
              <SelectTrigger className="text-sm px-2 py-1 border border-gray-300 rounded w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="js">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto bg-gray-900 rounded code-block text-xs sm:text-sm p-4 text-white whitespace-pre">
          {renderCode()}
        </div>
      </CardContent>
    </Card>
  );
};

export default CodePanel;
