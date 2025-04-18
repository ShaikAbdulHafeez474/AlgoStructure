import React, { useState } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { AlgorithmCategory, AlgorithmType } from '@shared/schema';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { cn } from '@/lib/utils';

interface AlgorithmOption {
  label: string;
  value: AlgorithmType;
}

interface AlgorithmCategoryDefinition {
  type: AlgorithmCategory;
  label: string;
  algorithms: AlgorithmOption[];
}

const categories: AlgorithmCategoryDefinition[] = [
  {
    type: 'tree',
    label: 'Trees',
    algorithms: [
      { label: 'Binary Search Tree', value: 'bst' },
      { label: 'AVL Tree', value: 'avl' },
      { label: 'Heap', value: 'heap' }
    ]
  },
  {
    type: 'graph',
    label: 'Graphs',
    algorithms: [
      { label: 'Depth-First Search', value: 'dfs' },
      { label: 'Breadth-First Search', value: 'bfs' },
      { label: 'Dijkstra\'s Algorithm', value: 'dijkstra' },
      { label: 'Kruskal\'s Algorithm', value: 'kruskal' },
      { label: 'Prim\'s Algorithm', value: 'prim' }
    ]
  },
  {
    type: 'dp',
    label: 'Dynamic Programming',
    algorithms: [
      { label: 'Fibonacci', value: 'fibonacci' },
      { label: 'Knapsack Problem', value: 'knapsack' },
      { label: 'Longest Common Subsequence', value: 'lcs' }
    ]
  },
  {
    type: 'sorting',
    label: 'Sorting Algorithms',
    algorithms: [
      { label: 'QuickSort', value: 'quicksort' },
      { label: 'MergeSort', value: 'mergesort' },
      { label: 'HeapSort', value: 'heapsort' }
    ]
  }
];

const AlgorithmSidebar: React.FC = () => {
  const { selectAlgorithm, currentAlgorithm } = useAlgorithm();
  const [defaultValues] = useState(['tree']); // Default open accordion item

  return (
    <aside className="lg:w-80 bg-surface rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-primary text-white">
        <h2 className="text-lg font-semibold">Data Structures & Algorithms</h2>
      </div>
      <div className="overflow-y-auto flex-grow p-4">
        <Accordion type="multiple" defaultValue={defaultValues} className="space-y-4">
          {categories.map((category) => (
            <AccordionItem key={category.type} value={category.type} className="border-0">
              <AccordionTrigger className="py-2 px-3 bg-background rounded">
                <span className="font-medium">{category.label}</span>
              </AccordionTrigger>
              <AccordionContent className="mt-2 ml-4 space-y-1">
                {category.algorithms.map((algo) => (
                  <Button 
                    key={algo.value}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start py-1 px-3 rounded hover:bg-background transition-colors",
                      currentAlgorithm?.type === algo.value ? "text-primary" : ""
                    )}
                    onClick={() => selectAlgorithm(algo.value)}
                  >
                    {algo.label}
                  </Button>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};

export default AlgorithmSidebar;
