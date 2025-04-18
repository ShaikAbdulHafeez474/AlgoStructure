import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  AlgorithmType, 
  AlgorithmOperation, 
  AlgorithmOperationRequest, 
  AlgorithmOperationResponse,
  ExecutionStep
} from "@shared/schema";
import path from "path";
import fs from "fs";

// Mock implementations until WebAssembly modules are compiled and loaded
// In production, these would be replaced by WebAssembly functions
// Binary Search Tree operations
const mockOperations = {
  bst: {
    insert: async (value: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('bst', 'insert', value);
    },
    delete: async (value: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('bst', 'delete', value);
    },
    search: async (value: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('bst', 'search', value);
    }
  },
  // Graph operations
  graph: {
    dfs: async (startNode: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('dfs', 'traverse', startNode);
    },
    bfs: async (startNode: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('bfs', 'traverse', startNode);
    },
    dijkstra: async (startNode: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('dijkstra', 'findPath', startNode);
    }
  },
  // Dynamic Programming operations
  dp: {
    fibonacci: async (n: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('fibonacci', 'calculate', n);
    },
    knapsack: async (capacity: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('knapsack', 'optimize', capacity);
    },
    lcs: async (length: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('lcs', 'calculate', length);
    }
  },
  // Sorting operations
  sorting: {
    quicksort: async (size: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('quicksort', 'sort', size);
    },
    mergesort: async (size: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('mergesort', 'sort', size);
    },
    heapsort: async (size: number): Promise<ExecutionStep[]> => {
      return generateMockExecutionSteps('heapsort', 'sort', size);
    }
  }
};

// This function generates mock execution steps for algorithm visualization
// It will be replaced by actual WebAssembly implementation
function generateMockExecutionSteps(
  type: AlgorithmType,
  operation: AlgorithmOperation,
  value: number
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  
  // Generate 5 steps for demo purposes
  for (let i = 0; i < 5; i++) {
    const step: ExecutionStep = {
      state: {
        nodes: [
          { id: '1', value: 50, x: 400, y: 60 },
          { id: '2', value: 25, x: 200, y: 180 },
          { id: '3', value: 75, x: 600, y: 180 },
          { id: '4', value: 15, x: 100, y: 300 }
        ],
        edges: [
          { source: '1', target: '2' },
          { source: '1', target: '3' },
          { source: '2', target: '4' }
        ],
        step: i + 1,
        totalSteps: 5,
        message: `Step ${i + 1}: ${operation} operation on ${type}`
      },
      code: {
        content: `// ${type} ${operation} code would be shown here`,
        highlightLines: [i + 1],
        language: 'cpp'
      },
      description: `${type} ${operation} step ${i + 1}`
    };
    
    steps.push(step);
  }
  
  return steps;
}

// Function to perform an algorithm operation
async function performAlgorithmOperation(
  type: AlgorithmType,
  operation: AlgorithmOperation,
  value: number
): Promise<ExecutionStep[]> {
  // Map the algorithm type and operation to the appropriate function
  switch (type) {
    case 'bst':
    case 'avl':
    case 'heap':
      return mockOperations.bst[operation as keyof typeof mockOperations.bst](value);
      
    case 'dfs':
    case 'bfs':
    case 'dijkstra':
    case 'kruskal':
    case 'prim':
      return mockOperations.graph[type as keyof typeof mockOperations.graph](value);
      
    case 'fibonacci':
    case 'knapsack':
    case 'lcs':
      return mockOperations.dp[type as keyof typeof mockOperations.dp](value);
      
    case 'quicksort':
    case 'mergesort':
    case 'heapsort':
      return mockOperations.sorting[type as keyof typeof mockOperations.sorting](value);
      
    default:
      throw new Error(`Unsupported algorithm type: ${type}`);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Algorithm operation endpoint
  app.post('/api/algorithm/operation', async (req, res) => {
    try {
      const { type, operation, value } = req.body as AlgorithmOperationRequest;
      
      if (!type || !operation) {
        return res.status(400).json({ 
          success: false, 
          errorMessage: 'Algorithm type and operation are required' 
        });
      }
      
      const executionSteps = await performAlgorithmOperation(type, operation, value || 0);
      
      const response: AlgorithmOperationResponse = {
        success: true,
        executionSteps
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error performing algorithm operation:', error);
      res.status(500).json({ 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });
  
  // Get available algorithms endpoint
  app.get('/api/algorithms', (req, res) => {
    const algorithms = [
      {
        name: 'Binary Search Tree',
        type: 'bst',
        category: 'tree',
        description: 'A binary search tree is a node-based binary tree data structure where each node has a value and the left subtree contains only nodes with values less than the node\'s value, while the right subtree only contains nodes with values greater than the node\'s value.',
        complexity: {
          time: 'O(log n)',
          space: 'O(h)'
        }
      },
      {
        name: 'AVL Tree',
        type: 'avl',
        category: 'tree',
        description: 'An AVL tree is a self-balancing binary search tree where the heights of the two child subtrees of any node differ by at most one.',
        complexity: {
          time: 'O(log n)',
          space: 'O(h)'
        }
      },
      {
        name: 'Heap',
        type: 'heap',
        category: 'tree',
        description: 'A heap is a specialized tree-based data structure that satisfies the heap property: if P is a parent node of C, then the key of P is ordered with respect to the key of C for all nodes.',
        complexity: {
          time: 'O(log n)',
          space: 'O(1)'
        }
      },
      {
        name: 'Depth-First Search',
        type: 'dfs',
        category: 'graph',
        description: 'Depth-First Search is an algorithm for traversing or searching tree or graph data structures that explores as far as possible along each branch before backtracking.',
        complexity: {
          time: 'O(V + E)',
          space: 'O(V)'
        }
      },
      {
        name: 'Breadth-First Search',
        type: 'bfs',
        category: 'graph',
        description: 'Breadth-First Search is an algorithm for traversing or searching tree or graph data structures that explores all neighbor nodes at the present depth before moving on to nodes at the next depth level.',
        complexity: {
          time: 'O(V + E)',
          space: 'O(V)'
        }
      },
      {
        name: 'Dijkstra\'s Algorithm',
        type: 'dijkstra',
        category: 'graph',
        description: 'Dijkstra\'s Algorithm finds the shortest paths between nodes in a graph, which may represent, for example, road networks.',
        complexity: {
          time: 'O(E log V)',
          space: 'O(V)'
        }
      },
      {
        name: 'Kruskal\'s Algorithm',
        type: 'kruskal',
        category: 'graph',
        description: 'Kruskal\'s Algorithm finds a minimum spanning tree for a connected weighted graph, adding increasing cost edges at each step.',
        complexity: {
          time: 'O(E log E)',
          space: 'O(V)'
        }
      },
      {
        name: 'Prim\'s Algorithm',
        type: 'prim',
        category: 'graph',
        description: 'Prim\'s Algorithm finds a minimum spanning tree for a weighted undirected graph, growing a tree one edge at a time.',
        complexity: {
          time: 'O(E log V)',
          space: 'O(V)'
        }
      },
      {
        name: 'Fibonacci',
        type: 'fibonacci',
        category: 'dp',
        description: 'The Fibonacci sequence is a sequence where each number is the sum of the two preceding ones, starting from 0 and 1.',
        complexity: {
          time: 'O(n)',
          space: 'O(n)'
        }
      },
      {
        name: 'Knapsack Problem',
        type: 'knapsack',
        category: 'dp',
        description: 'The Knapsack Problem is a problem in combinatorial optimization where we need to maximize the value of items in a knapsack without exceeding its weight capacity.',
        complexity: {
          time: 'O(nW)',
          space: 'O(nW)'
        }
      },
      {
        name: 'Longest Common Subsequence',
        type: 'lcs',
        category: 'dp',
        description: 'The Longest Common Subsequence problem finds the longest subsequence common to all sequences in a set of sequences.',
        complexity: {
          time: 'O(m*n)',
          space: 'O(m*n)'
        }
      },
      {
        name: 'QuickSort',
        type: 'quicksort',
        category: 'sorting',
        description: 'QuickSort is an efficient sorting algorithm that uses a divide-and-conquer strategy with a pivot element to partition the array.',
        complexity: {
          time: 'O(n log n)',
          space: 'O(log n)'
        }
      },
      {
        name: 'MergeSort',
        type: 'mergesort',
        category: 'sorting',
        description: 'MergeSort is a divide and conquer algorithm that divides the input array into two halves, sorts them separately, and then merges the sorted halves.',
        complexity: {
          time: 'O(n log n)',
          space: 'O(n)'
        }
      },
      {
        name: 'HeapSort',
        type: 'heapsort',
        category: 'sorting',
        description: 'HeapSort is a comparison-based sorting algorithm that uses a binary heap data structure to build a heap and then repeatedly extracts the maximum element.',
        complexity: {
          time: 'O(n log n)',
          space: 'O(1)'
        }
      }
    ];
    
    res.json(algorithms);
  });

  const httpServer = createServer(app);

  return httpServer;
}
