# Algorithm Visualizer

An interactive educational tool for visualizing complex data structures and algorithms with clean, font-issue-free web visualization. This project demonstrates algorithms related to trees, graphs, dynamic programming, and sorting techniques through intuitive visual representations.

## Features

- **Algorithm Categories**:
  - **Trees**: Binary Search Tree, AVL Tree, Heap
  - **Graphs**: Depth-First Search, Breadth-First Search, Dijkstra's Algorithm, Kruskal's Algorithm, Prim's Algorithm
  - **Dynamic Programming**: Fibonacci, Knapsack Problem, Longest Common Subsequence
  - **Sorting Algorithms**: QuickSort, MergeSort, HeapSort

- **Interactive Controls**: 
  - Play/pause algorithm execution
  - Step forward/backward through algorithm steps
  - Adjust visualization speed
  - Reset visualization
  
- **Educational Context**:
  - View algorithm code alongside visualization
  - Highlighted code lines matching current step
  - Time and space complexity information

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express.js
- **Algorithm Implementations**: C++ compiled to WebAssembly
- **Visualization**: Canvas/SVG Rendering

## Prerequisites

To run this project locally, you'll need:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- For compiling C++ algorithms (optional): [Emscripten](https://emscripten.org/docs/getting_started/downloads.html)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd algorithm-visualizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   This command will start both the Express backend and the Vite frontend development server.

4. **Open in your browser**:
   The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                  # Frontend code
│   ├── src/                 # React components and application logic
│   │   ├── components/      # UI components
│   │   ├── contexts/        # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and libraries
│   │   ├── pages/           # Application pages
│   │   ├── App.tsx          # Main application component
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/                  # Backend code
│   ├── algorithms/          # C++ algorithm implementations
│   ├── index.ts             # Server entry point
│   └── routes.ts            # API routes
├── shared/                  # Shared code between frontend and backend
│   └── schema.ts            # TypeScript types and schemas
├── drizzle.config.ts        # Database configuration (not needed for basic usage)
├── package.json             # Project dependencies and scripts
├── tailwind.config.ts       # TailwindCSS configuration
└── vite.config.ts           # Vite configuration
```

## Compiling C++ Algorithms to WebAssembly (Optional)

The project includes a script to compile C++ algorithm implementations to WebAssembly:

1. **Install Emscripten** (if not already installed)
   Follow the [official guide](https://emscripten.org/docs/getting_started/downloads.html)

2. **Compile algorithms**:
   ```bash
   node server/algorithms/compile.js
   ```

## Development Notes

- **Adding new algorithms**: 
  1. Create a C++ implementation in `server/algorithms/`
  2. Update `shared/schema.ts` to include the new algorithm type
  3. Create a visualization component in `client/src/components/algorithm-visualizations/`
  4. Add algorithm information to the API in `server/routes.ts`

- **Modifying visualization**:
  Update the drawing functions in `client/src/lib/canvas-utils.ts`

## Troubleshooting

- **Server not starting**: Make sure port 5000 is not already in use by another application
- **Visualization not appearing**: Check browser console for any errors
- **WebAssembly compilation issues**: Ensure Emscripten is correctly installed and in your PATH

## License

[MIT License](LICENSE)