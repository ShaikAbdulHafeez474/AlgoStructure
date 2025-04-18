import { pgTable, text, serial, integer, boolean, json, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Algorithm and data structure categories
export type AlgorithmCategory = 
  | 'tree' 
  | 'graph' 
  | 'dp' 
  | 'sorting';

// Specific algorithm types
export type AlgorithmType = 
  // Trees
  | 'bst' 
  | 'avl' 
  | 'heap'
  // Graphs
  | 'dfs'
  | 'bfs'
  | 'dijkstra'
  | 'kruskal'
  | 'prim'
  // Dynamic Programming
  | 'fibonacci'
  | 'knapsack'
  | 'lcs'
  // Sorting
  | 'quicksort'
  | 'mergesort'
  | 'heapsort';

// Algorithm operations
export type AlgorithmOperation = 
  // Tree operations
  | 'insert'
  | 'delete'
  | 'search'
  | 'traverse'
  // Graph operations
  | 'addNode'
  | 'addEdge'
  | 'removeNode'
  | 'removeEdge'
  | 'findPath'
  // DP operations
  | 'calculate'
  | 'optimize'
  // Sorting operations
  | 'sort'
  | 'partition';

// Algorithm implementation languages
export type ImplementationLanguage = 'cpp' | 'js';

// Definition of algorithm state for visualization
export type AlgorithmState = {
  nodes: Array<{
    id: string;
    value: number | string;
    x: number;
    y: number;
    color?: string;
    highlighted?: boolean;
  }>;
  edges: Array<{
    source: string;
    target: string;
    value?: number;
    color?: string;
    highlighted?: boolean;
  }>;
  auxData?: Record<string, any>;
  step: number;
  totalSteps: number;
  message?: string;
};

// Algorithm execution step interface
export interface ExecutionStep {
  state: AlgorithmState;
  code: {
    content: string;
    highlightLines: number[];
    language: ImplementationLanguage;
  };
  description: string;
}

// Database schema for algorithms
export const algorithms = pgTable("algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  codeContent: text("code_content").notNull(),
  jsImplementation: text("js_implementation"),
  complexity: jsonb("complexity").notNull(),
});

// Schema for inserting new algorithms
export const insertAlgorithmSchema = createInsertSchema(algorithms);

export type InsertAlgorithm = z.infer<typeof insertAlgorithmSchema>;
export type Algorithm = typeof algorithms.$inferSelect;

// Optional: Database schema for user saved algorithm states/configurations
export const userSavedStates = pgTable("user_saved_states", {
  id: serial("id").primaryKey(),
  algorithmType: text("algorithm_type").notNull(),
  initialData: jsonb("initial_data").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSavedStateSchema = createInsertSchema(userSavedStates);

export type InsertUserSavedState = z.infer<typeof insertUserSavedStateSchema>;
export type UserSavedState = typeof userSavedStates.$inferSelect;

// API request/response types for algorithm operations
export interface AlgorithmOperationRequest {
  type: AlgorithmType;
  operation: AlgorithmOperation;
  value?: number | string;
  data?: any;
}

export interface AlgorithmOperationResponse {
  success: boolean;
  executionSteps: ExecutionStep[];
  errorMessage?: string;
}
