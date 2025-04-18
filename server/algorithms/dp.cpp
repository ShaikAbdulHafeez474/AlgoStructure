// Dynamic Programming algorithms implementation in C++

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

using namespace std;
using namespace emscripten;

// Visualization structures
struct CellPosition {
    int id;
    string value;
    double x;
    double y;
    bool highlighted;
};

// Structure to hold algorithm state
struct AlgorithmState {
    vector<CellPosition> cells;
    vector<string> memoTable; // For visual representation of the memoization table
    string message;
    int step;
    int totalSteps;
};

// Dynamic Programming class
class DynamicProgramming {
private:
    vector<AlgorithmState> states;
    int currentStep;
    int totalSteps;
    
    // Helper function to create grid visualization
    void createGrid(vector<CellPosition>& cells, const vector<vector<int>>& grid, int highlightRow = -1, int highlightCol = -1) {
        cells.clear();
        const int cellSize = 50;
        const int startX = 100;
        const int startY = 100;
        
        int id = 0;
        for (int i = 0; i < grid.size(); i++) {
            for (int j = 0; j < grid[i].size(); j++) {
                CellPosition cell;
                cell.id = id++;
                cell.value = to_string(grid[i][j]);
                cell.x = startX + j * cellSize;
                cell.y = startY + i * cellSize;
                cell.highlighted = (i == highlightRow && j == highlightCol);
                cells.push_back(cell);
            }
        }
    }
    
    // Helper function to create array visualization
    void createArray(vector<CellPosition>& cells, const vector<int>& array, int highlightIndex = -1) {
        cells.clear();
        const int cellSize = 50;
        const int startX = 100;
        const int startY = 150;
        
        for (int i = 0; i < array.size(); i++) {
            CellPosition cell;
            cell.id = i;
            cell.value = to_string(array[i]);
            cell.x = startX + i * cellSize;
            cell.y = startY;
            cell.highlighted = (i == highlightIndex);
            cells.push_back(cell);
        }
    }

public:
    DynamicProgramming() : currentStep(0), totalSteps(0) {}
    
    // Fibonacci using dynamic programming
    void fibonacci(int n) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.message = "Calculating Fibonacci(" + to_string(n) + ") using Dynamic Programming";
        initialState.step = 1;
        
        // Initialize DP array
        vector<int> fib(n + 1, 0);
        if (n >= 1) {
            fib[1] = 1;
        }
        
        // Create visualization for initial state
        createArray(initialState.cells, fib);
        
        // Add initial state
        states.push_back(initialState);
        
        // Fill the DP array
        for (int i = 2; i <= n; i++) {
            fib[i] = fib[i-1] + fib[i-2];
            
            // Create a state for this step
            AlgorithmState state = initialState;
            state.step = states.size() + 1;
            state.message = "Computing Fibonacci(" + to_string(i) + ") = Fibonacci(" + 
                           to_string(i-1) + ") + Fibonacci(" + to_string(i-2) + ") = " +
                           to_string(fib[i-1]) + " + " + to_string(fib[i-2]) + " = " + to_string(fib[i]);
            
            // Update array visualization
            createArray(state.cells, fib, i);
            
            // Add this state
            states.push_back(state);
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "Fibonacci(" + to_string(n) + ") = " + to_string(fib[n]);
        
        createArray(finalState.cells, fib, n);
        
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // 0-1 Knapsack Problem
    void knapsack(const vector<int>& values, const vector<int>& weights, int capacity) {
        states.clear();
        
        if (values.empty() || weights.empty() || values.size() != weights.size()) {
            // Invalid inputs
            return;
        }
        
        int n = values.size();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.message = "Solving 0-1 Knapsack Problem with " + to_string(n) + " items and capacity " + to_string(capacity);
        initialState.step = 1;
        
        // Initialize DP table
        vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
        
        // Create visualization for initial state
        createGrid(initialState.cells, dp);
        
        // Add the values and weights as part of the message
        string itemsInfo = "Items: [";
        for (int i = 0; i < n; i++) {
            itemsInfo += "(value=" + to_string(values[i]) + ", weight=" + to_string(weights[i]) + ")";
            if (i < n - 1) itemsInfo += ", ";
        }
        itemsInfo += "]";
        
        initialState.message += "\n" + itemsInfo;
        
        // Add initial state
        states.push_back(initialState);
        
        // Fill the DP table
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                // Item i-1 can't be included
                if (weights[i-1] > w) {
                    dp[i][w] = dp[i-1][w];
                } else {
                    // Max of including or excluding item i-1
                    dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]]);
                }
                
                // Create a state for this step
                AlgorithmState state = initialState;
                state.step = states.size() + 1;
                
                if (weights[i-1] > w) {
                    state.message = "Item " + to_string(i) + " (weight=" + to_string(weights[i-1]) + 
                                   ") is too heavy for capacity " + to_string(w) + ", take previous value " + 
                                   to_string(dp[i-1][w]);
                } else {
                    state.message = "For item " + to_string(i) + " (value=" + to_string(values[i-1]) + 
                                   ", weight=" + to_string(weights[i-1]) + ") and capacity " + to_string(w) + 
                                   ":\nMax of (excluding=" + to_string(dp[i-1][w]) + ", including=" + 
                                   to_string(values[i-1] + dp[i-1][w - weights[i-1]]) + ") = " + to_string(dp[i][w]);
                }
                
                // Update grid visualization
                createGrid(state.cells, dp, i, w);
                
                // Add this state
                states.push_back(state);
            }
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "Maximum value: " + to_string(dp[n][capacity]);
        
        createGrid(finalState.cells, dp);
        
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // Longest Common Subsequence (LCS)
    void longestCommonSubsequence(const string& str1, const string& str2) {
        states.clear();
        
        if (str1.empty() || str2.empty()) {
            // Invalid inputs
            return;
        }
        
        int m = str1.length();
        int n = str2.length();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.message = "Finding Longest Common Subsequence of \"" + str1 + "\" and \"" + str2 + "\"";
        initialState.step = 1;
        
        // Initialize DP table
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
        
        // Create visualization for initial state
        createGrid(initialState.cells, dp);
        
        // Add initial state
        states.push_back(initialState);
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (str1[i-1] == str2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                } else {
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
                }
                
                // Create a state for this step
                AlgorithmState state = initialState;
                state.step = states.size() + 1;
                
                if (str1[i-1] == str2[j-1]) {
                    state.message = "Characters match: " + string(1, str1[i-1]) + 
                                   " = " + string(1, str2[j-1]) + ", incrementing from diagonal";
                } else {
                    state.message = "Characters don't match: " + string(1, str1[i-1]) + 
                                   " != " + string(1, str2[j-1]) + ", taking max of up and left";
                }
                
                // Update grid visualization
                createGrid(state.cells, dp, i, j);
                
                // Add this state
                states.push_back(state);
            }
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "Length of LCS: " + to_string(dp[m][n]);
        
        // Reconstruct the LCS
        string lcs = "";
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (str1[i-1] == str2[j-1]) {
                lcs = str1[i-1] + lcs;
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }
        
        finalState.message += "\nLCS: \"" + lcs + "\"";
        
        createGrid(finalState.cells, dp);
        
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // Get the number of steps
    int getStepCount() const {
        return totalSteps;
    }

    // Get a specific step
    AlgorithmState getStep(int step) const {
        if (step < 0 || step >= states.size()) {
            return AlgorithmState();
        }
        return states[step];
    }
};

// Global instance
DynamicProgramming dp;

// External interface functions

// Perform a DP operation
extern "C" EMSCRIPTEN_KEEPALIVE int performDPOperation(int algorithm, int param1, int param2 = 0) {
    switch (algorithm) {
        case 0: // Fibonacci
            dp.fibonacci(param1);
            break;
        case 1: // Knapsack
            {
                // Use predefined values and weights
                vector<int> values = {60, 100, 120};
                vector<int> weights = {10, 20, 30};
                dp.knapsack(values, weights, param1);
            }
            break;
        case 2: // LCS
            {
                // Use predefined strings
                string str1 = "ABCBDAB";
                string str2 = "BDCABA";
                dp.longestCommonSubsequence(str1, str2);
            }
            break;
        default:
            return -1;
    }
    return dp.getStepCount();
}

// Get the number of steps in the current operation
extern "C" EMSCRIPTEN_KEEPALIVE int getDPStepCount() {
    return dp.getStepCount();
}

// Get a specific step's data
extern "C" EMSCRIPTEN_KEEPALIVE char* getDPStepData(int step) {
    AlgorithmState state = dp.getStep(step);
    
    // Convert state to JSON or another format that can be passed to JavaScript
    string result = "{\"step\":" + to_string(state.step) + 
                    ",\"totalSteps\":" + to_string(state.totalSteps) + 
                    ",\"message\":\"" + state.message + "\"}";
    
    // Allocate memory for the result that JavaScript can free later
    char* buffer = (char*)malloc(result.length() + 1);
    strcpy(buffer, result.c_str());
    return buffer;
}

// Free memory allocated for step data
extern "C" EMSCRIPTEN_KEEPALIVE void freeDPStepData(char* ptr) {
    free(ptr);
}

// Bind the C++ class and methods to JavaScript
EMSCRIPTEN_BINDINGS(dp_module) {
    class_<DynamicProgramming>("DynamicProgramming")
        .constructor()
        .function("fibonacci", &DynamicProgramming::fibonacci)
        .function("knapsack", &DynamicProgramming::knapsack)
        .function("longestCommonSubsequence", &DynamicProgramming::longestCommonSubsequence)
        .function("getStepCount", &DynamicProgramming::getStepCount);
}

// Main function required for emscripten
int main() {
    // Initialize with Fibonacci example
    dp.fibonacci(10);
    return 0;
}
