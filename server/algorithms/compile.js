// Script to compile C++ algorithm files to WebAssembly using Emscripten

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if Emscripten is available in the environment
function checkEmscripten() {
  try {
    execSync('emcc --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('Emscripten (emcc) not found. Please make sure it is installed and in your PATH.');
    return false;
  }
}

// Compile a C++ file to WebAssembly
function compileToWasm(inputFile, outputFilename) {
  const inputPath = path.resolve(__dirname, inputFile);
  const outputDir = path.resolve(__dirname, '../../dist/algorithms');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, outputFilename);
  
  // Command to compile C++ to WebAssembly with Emscripten
  const command = `emcc ${inputPath} \
    -O2 \
    -s WASM=1 \
    -s EXPORTED_RUNTIME_METHODS=["ccall","cwrap"] \
    -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_main']" \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME="create${outputFilename.split('.')[0].charAt(0).toUpperCase() + outputFilename.split('.')[0].slice(1)}Module" \
    -o ${outputPath}`;
  
  try {
    console.log(`Compiling ${inputFile} to WebAssembly...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`Successfully compiled ${inputFile} to ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error compiling ${inputFile}:`, error.message);
    return false;
  }
}

// Main function to compile all algorithm files
function compileAllAlgorithms() {
  if (!checkEmscripten()) {
    console.error('Emscripten is not available. Compilation aborted.');
    return;
  }
  
  const algorithms = [
    { input: 'tree.cpp', output: 'tree.js' },
    { input: 'graph.cpp', output: 'graph.js' },
    { input: 'dp.cpp', output: 'dp.js' },
    { input: 'sort.cpp', output: 'sort.js' }
  ];
  
  let allSuccessful = true;
  
  for (const algorithm of algorithms) {
    const success = compileToWasm(algorithm.input, algorithm.output);
    if (!success) {
      allSuccessful = false;
    }
  }
  
  if (allSuccessful) {
    console.log('All algorithms compiled successfully!');
  } else {
    console.error('Some algorithms failed to compile. Check the errors above.');
  }
}

// Run the compilation
compileAllAlgorithms();
