import { useContext } from 'react';
import { AlgorithmContext } from '@/contexts/AlgorithmContext';

export const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  
  if (context === undefined) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  
  return context;
};
