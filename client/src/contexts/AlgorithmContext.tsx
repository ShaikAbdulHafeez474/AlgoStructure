import React, { createContext, useCallback, useState, useEffect, ReactNode } from 'react';
import { 
  AlgorithmType, 
  AlgorithmOperation, 
  ExecutionStep,
  AlgorithmOperationRequest
} from '@shared/schema';
import { performAlgorithmOperation } from '@/lib/algorithm-wasm';
import { apiRequest } from '@/lib/queryClient';

interface AlgorithmContextProps {
  currentAlgorithm: {
    name: string;
    type: AlgorithmType;
    category: string;
    description: string;
    complexity: {
      time: string;
      space: string;
    };
  } | null;
  selectAlgorithm: (type: AlgorithmType) => void;
  currentStep: ExecutionStep | null;
  executionSteps: ExecutionStep[];
  isPlaying: boolean;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  speed: number;
  setSpeed: (speed: number) => void;
  performOperation: (operation: AlgorithmOperation) => void;
  resetVisualization: () => void;
  operationValue: number;
  setOperationValue: (value: number) => void;
  totalSteps: number;
}

export const AlgorithmContext = createContext<AlgorithmContextProps>({
  currentAlgorithm: null,
  selectAlgorithm: () => {},
  currentStep: null,
  executionSteps: [],
  isPlaying: false,
  togglePlay: () => {},
  stepForward: () => {},
  stepBackward: () => {},
  speed: 3,
  setSpeed: () => {},
  performOperation: () => {},
  resetVisualization: () => {},
  operationValue: 42,
  setOperationValue: () => {},
  totalSteps: 0
});

interface AlgorithmProviderProps {
  children: ReactNode;
}

// Map algorithm types to display names
const algorithmNameMap: Record<AlgorithmType, string> = {
  'bst': 'Binary Search Tree',
  'avl': 'AVL Tree',
  'heap': 'Heap',
  'dfs': 'Depth-First Search',
  'bfs': 'Breadth-First Search',
  'dijkstra': 'Dijkstra\'s Algorithm',
  'kruskal': 'Kruskal\'s Algorithm',
  'prim': 'Prim\'s Algorithm',
  'fibonacci': 'Fibonacci',
  'knapsack': 'Knapsack Problem',
  'lcs': 'Longest Common Subsequence',
  'quicksort': 'QuickSort',
  'mergesort': 'MergeSort',
  'heapsort': 'HeapSort'
};

// Map algorithm types to categories
const algorithmCategoryMap: Record<AlgorithmType, string> = {
  'bst': 'tree',
  'avl': 'tree',
  'heap': 'tree',
  'dfs': 'graph',
  'bfs': 'graph',
  'dijkstra': 'graph',
  'kruskal': 'graph',
  'prim': 'graph',
  'fibonacci': 'dp',
  'knapsack': 'dp',
  'lcs': 'dp',
  'quicksort': 'sorting',
  'mergesort': 'sorting',
  'heapsort': 'sorting'
};

// Map algorithm types to descriptions
const algorithmDescriptionMap: Record<AlgorithmType, string> = {
  'bst': 'A binary search tree is a node-based binary tree data structure where each node has a value and the left subtree contains only nodes with values less than the node\'s value, while the right subtree only contains nodes with values greater than the node\'s value.',
  'avl': 'An AVL tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.',
  'heap': 'A heap is a specialized tree-based data structure that satisfies the heap property: if P is a parent node of C, then the key of P is ordered with respect to the key of C for all nodes.',
  'dfs': 'Depth-First Search is an algorithm for traversing or searching tree or graph data structures that explores as far as possible along each branch before backtracking.',
  'bfs': 'Breadth-First Search is an algorithm for traversing or searching tree or graph data structures that explores all neighbor nodes at the present depth before moving on to nodes at the next depth level.',
  'dijkstra': 'Dijkstra\'s Algorithm finds the shortest paths between nodes in a graph, which may represent, for example, road networks.',
  'kruskal': 'Kruskal\'s Algorithm finds a minimum spanning tree for a connected weighted graph, adding increasing cost edges at each step.',
  'prim': 'Prim\'s Algorithm finds a minimum spanning tree for a weighted undirected graph, growing a tree one edge at a time.',
  'fibonacci': 'The Fibonacci sequence is a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.',
  'knapsack': 'The Knapsack Problem is a problem in combinatorial optimization where we need to maximize the value of items in a knapsack without exceeding its weight capacity.',
  'lcs': 'The Longest Common Subsequence problem finds the longest subsequence common to all sequences in a set of sequences.',
  'quicksort': 'QuickSort is an efficient sorting algorithm that uses a divide-and-conquer strategy with a pivot element to partition the array.',
  'mergesort': 'MergeSort is a divide and conquer algorithm that divides the input array into two halves, sorts them separately, and then merges the sorted halves.',
  'heapsort': 'HeapSort is a comparison-based sorting algorithm that uses a binary heap data structure to build a heap and then repeatedly extracts the maximum element.'
};

// Map algorithm types to complexities
const algorithmComplexityMap: Record<AlgorithmType, { time: string, space: string }> = {
  'bst': { time: 'O(log n)', space: 'O(h)' },
  'avl': { time: 'O(log n)', space: 'O(h)' },
  'heap': { time: 'O(log n)', space: 'O(1)' },
  'dfs': { time: 'O(V + E)', space: 'O(V)' },
  'bfs': { time: 'O(V + E)', space: 'O(V)' },
  'dijkstra': { time: 'O(E log V)', space: 'O(V)' },
  'kruskal': { time: 'O(E log E)', space: 'O(V)' },
  'prim': { time: 'O(E log V)', space: 'O(V)' },
  'fibonacci': { time: 'O(n)', space: 'O(n)' },
  'knapsack': { time: 'O(nW)', space: 'O(nW)' },
  'lcs': { time: 'O(m*n)', space: 'O(m*n)' },
  'quicksort': { time: 'O(n log n)', space: 'O(log n)' },
  'mergesort': { time: 'O(n log n)', space: 'O(n)' },
  'heapsort': { time: 'O(n log n)', space: 'O(1)' }
};

export const AlgorithmProvider: React.FC<AlgorithmProviderProps> = ({ children }) => {
  // State for current algorithm and execution
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmContextProps['currentAlgorithm']>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(3);
  const [operationValue, setOperationValue] = useState<number>(42);
  const [playInterval, setPlayInterval] = useState<number | undefined>(undefined);

  // Compute current step from index
  const currentStep = executionSteps.length > 0 && currentStepIndex < executionSteps.length
    ? executionSteps[currentStepIndex]
    : null;

  // Total steps
  const totalSteps = executionSteps.length;

  // Select an algorithm
  const selectAlgorithm = useCallback((type: AlgorithmType) => {
    setCurrentAlgorithm({
      name: algorithmNameMap[type] || type,
      type,
      category: algorithmCategoryMap[type] || 'unknown',
      description: algorithmDescriptionMap[type] || '',
      complexity: algorithmComplexityMap[type] || { time: 'Unknown', space: 'Unknown' }
    });
    setExecutionSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Step forward in the execution
  const stepForward = useCallback(() => {
    if (currentStepIndex < executionSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else if (isPlaying) {
      setIsPlaying(false);
    }
  }, [currentStepIndex, executionSteps.length, isPlaying]);

  // Step backward in the execution
  const stepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Reset the visualization
  const resetVisualization = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Perform an algorithm operation
  const performOperation = useCallback(async (operation: AlgorithmOperation) => {
    if (!currentAlgorithm) return;

    try {
      // Create request to backend API
      const request: AlgorithmOperationRequest = {
        type: currentAlgorithm.type,
        operation,
        value: operationValue
      };

      // In a real implementation, this would call the backend API
      // For now, we'll use the WASM module directly
      const steps = await performAlgorithmOperation(
        currentAlgorithm.type,
        operation,
        operationValue
      );
      
      setExecutionSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error performing operation:', error);
    }
  }, [currentAlgorithm, operationValue]);

  // Handle auto-play using useEffect
  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      if (playInterval) {
        clearInterval(playInterval);
      }
      
      // Set the interval based on speed
      // Speed is 1-5, with 5 being fastest
      const intervalTime = 2000 / speed;
      
      const interval = window.setInterval(() => {
        stepForward();
      }, intervalTime);
      
      setPlayInterval(interval);
    } else {
      // Clear interval when not playing
      if (playInterval) {
        clearInterval(playInterval);
        setPlayInterval(undefined);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (playInterval) {
        clearInterval(playInterval);
      }
    };
  }, [isPlaying, speed, stepForward, playInterval]);

  const contextValue: AlgorithmContextProps = {
    currentAlgorithm,
    selectAlgorithm,
    currentStep,
    executionSteps,
    isPlaying,
    togglePlay,
    stepForward,
    stepBackward,
    speed,
    setSpeed,
    performOperation,
    resetVisualization,
    operationValue,
    setOperationValue,
    totalSteps
  };

  return (
    <AlgorithmContext.Provider value={contextValue}>
      {children}
    </AlgorithmContext.Provider>
  );
};
