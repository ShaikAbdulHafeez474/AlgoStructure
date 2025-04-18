// Binary Search Tree implementation in C++

#include <iostream>
#include <vector>
#include <string>
#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

using namespace std;
using namespace emscripten;

// Node structure for the tree
struct Node {
    int data;
    Node* left;
    Node* right;
    
    Node(int value) : data(value), left(nullptr), right(nullptr) {}
};

// Representation of a node's position for visualization
struct NodePosition {
    int id;
    int value;
    double x;
    double y;
    bool highlighted;
};

// Representation of an edge between nodes for visualization
struct EdgePosition {
    int source;
    int target;
    bool highlighted;
};

// Structure to hold the current state of the algorithm
struct AlgorithmState {
    vector<NodePosition> nodes;
    vector<EdgePosition> edges;
    string message;
    int step;
    int totalSteps;
};

// Binary Search Tree class
class BinarySearchTree {
private:
    Node* root;
    vector<AlgorithmState> states;
    int currentStep;
    int totalSteps;
    
    // Recursive helper for insertion
    Node* insertRecursive(Node* current, int value, vector<int>& path) {
        // If tree is empty, create a new node
        if (current == nullptr) {
            return new Node(value);
        }
        
        // Keep track of the path taken
        path.push_back(current->data);
        
        // Navigate to the right position
        if (value < current->data) {
            current->left = insertRecursive(current->left, value, path);
        } 
        else if (value > current->data) {
            current->right = insertRecursive(current->right, value, path);
        }
        
        return current;
    }
    
    // Helper method to find a node by value
    Node* findNode(Node* current, int value, vector<int>& path) {
        if (current == nullptr) {
            return nullptr;
        }
        
        path.push_back(current->data);
        
        if (current->data == value) {
            return current;
        }
        
        if (value < current->data) {
            return findNode(current->left, value, path);
        } else {
            return findNode(current->right, value, path);
        }
    }
    
    // Helper method to calculate node positions for visualization
    void calculatePositions(Node* node, double x, double y, double horizontalSpacing, int level, map<int, NodePosition>& positions, int& nextId) {
        if (node == nullptr) {
            return;
        }
        
        // Assign ID and position to current node
        int id = nextId++;
        positions[node->data] = {id, node->data, x, y, false};
        
        // Calculate positions for children
        double nextSpacing = horizontalSpacing / 2;
        
        if (node->left) {
            calculatePositions(node->left, x - nextSpacing, y + 100, nextSpacing, level + 1, positions, nextId);
            // Add edge from current to left child
            edges.push_back({id, positions[node->left->data].id, false});
        }
        
        if (node->right) {
            calculatePositions(node->right, x + nextSpacing, y + 100, nextSpacing, level + 1, positions, nextId);
            // Add edge from current to right child
            edges.push_back({id, positions[node->right->data].id, false});
        }
    }
    
    // Create visualization states for insertion
    void createInsertionStates(int value) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.message = "Starting BST insertion for value " + to_string(value);
        initialState.step = 1;
        
        // Calculate positions for visualization
        map<int, NodePosition> positions;
        int nextId = 0;
        calculatePositions(root, 400, 60, 200, 0, positions, nextId);
        
        // Convert positions map to vector
        for (const auto& pair : positions) {
            initialState.nodes.push_back(pair.second);
        }
        
        // Add edges
        initialState.edges = edges;
        
        states.push_back(initialState);
        
        // Insert the value and track the path
        vector<int> path;
        root = insertRecursive(root, value, path);
        
        // Create states for each step of the path
        for (int i = 0; i < path.size(); i++) {
            AlgorithmState state = initialState;
            state.step = i + 2;
            state.message = "Comparing with node " + to_string(path[i]);
            
            // Highlight the current node in the path
            for (auto& node : state.nodes) {
                node.highlighted = (node.value == path[i]);
            }
            
            // Highlight the edge if applicable
            if (i > 0) {
                for (auto& edge : state.edges) {
                    // Find the edge between the previous and current node
                    if ((edge.source == getNodeIdByValue(state, path[i-1])) && 
                        (edge.target == getNodeIdByValue(state, path[i]))) {
                        edge.highlighted = true;
                    }
                }
            }
            
            states.push_back(state);
        }
        
        // Final state - adding the new node
        AlgorithmState finalState = states.back();
        finalState.step = path.size() + 2;
        finalState.message = "Inserted " + to_string(value) + " into the tree";
        
        // Calculate new positions after insertion
        positions.clear();
        nextId = 0;
        edges.clear();
        calculatePositions(root, 400, 60, 200, 0, positions, nextId);
        
        // Update nodes and edges for final state
        finalState.nodes.clear();
        for (const auto& pair : positions) {
            NodePosition node = pair.second;
            // Highlight the newly inserted node
            if (node.value == value) {
                node.highlighted = true;
            }
            finalState.nodes.push_back(node);
        }
        
        finalState.edges = edges;
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // Create visualization states for search
    void createSearchStates(int value) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.message = "Starting BST search for value " + to_string(value);
        initialState.step = 1;
        
        // Calculate positions for visualization
        map<int, NodePosition> positions;
        int nextId = 0;
        calculatePositions(root, 400, 60, 200, 0, positions, nextId);
        
        // Convert positions map to vector
        for (const auto& pair : positions) {
            initialState.nodes.push_back(pair.second);
        }
        
        // Add edges
        initialState.edges = edges;
        
        states.push_back(initialState);
        
        // Search for the value and track the path
        vector<int> path;
        Node* found = findNode(root, value, path);
        
        // Create states for each step of the path
        for (int i = 0; i < path.size(); i++) {
            AlgorithmState state = initialState;
            state.step = i + 2;
            
            if (path[i] == value) {
                state.message = "Found value " + to_string(value) + " at this node";
            } else {
                state.message = "Checking node " + to_string(path[i]) + ", moving to " + 
                               (value < path[i] ? "left" : "right");
            }
            
            // Highlight the current node in the path
            for (auto& node : state.nodes) {
                node.highlighted = (node.value == path[i]);
            }
            
            // Highlight the edge if applicable
            if (i > 0) {
                for (auto& edge : state.edges) {
                    // Find the edge between the previous and current node
                    if ((edge.source == getNodeIdByValue(state, path[i-1])) && 
                        (edge.target == getNodeIdByValue(state, path[i]))) {
                        edge.highlighted = true;
                    }
                }
            }
            
            states.push_back(state);
        }
        
        // Final state - result of search
        AlgorithmState finalState = states.back();
        finalState.step = path.size() + 2;
        
        if (found) {
            finalState.message = "Value " + to_string(value) + " found in the tree";
        } else {
            finalState.message = "Value " + to_string(value) + " not found in the tree";
        }
        
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // Helper to get a node's ID by its value
    int getNodeIdByValue(const AlgorithmState& state, int value) {
        for (const auto& node : state.nodes) {
            if (node.value == value) {
                return node.id;
            }
        }
        return -1;
    }
    
public:
    BinarySearchTree() : root(nullptr), currentStep(0), totalSteps(0) {}
    
    // Insert a value into the tree
    void insert(int value) {
        createInsertionStates(value);
    }
    
    // Search for a value in the tree
    bool search(int value) {
        createSearchStates(value);
        
        // Perform the actual search
        vector<int> path;
        Node* found = findNode(root, value, path);
        return found != nullptr;
    }
    
    // Get the current state
    AlgorithmState getCurrentState() {
        if (states.empty()) {
            return AlgorithmState();
        }
        return states[currentStep];
    }
    
    // Get the number of steps
    int getStepCount() {
        return totalSteps;
    }
    
    // Get a specific step
    AlgorithmState getStep(int step) {
        if (step < 0 || step >= states.size()) {
            return AlgorithmState();
        }
        return states[step];
    }
};

// Global instance of the BST
BinarySearchTree bst;

// External interface functions

// Perform an operation on the BST
extern "C" EMSCRIPTEN_KEEPALIVE int performOperation(int operation, int value) {
    switch (operation) {
        case 0: // Insert
            bst.insert(value);
            break;
        case 1: // Search
            bst.search(value);
            break;
        // Case 2 would be delete
        default:
            return -1;
    }
    return bst.getStepCount();
}

// Get the number of steps in the current operation
extern "C" EMSCRIPTEN_KEEPALIVE int getStepCount() {
    return bst.getStepCount();
}

// Get a specific step's data
extern "C" EMSCRIPTEN_KEEPALIVE char* getStepData(int step) {
    AlgorithmState state = bst.getStep(step);
    
    // Convert state to JSON or another format that can be passed to JavaScript
    // This is a simplified version - you'd need to serialize the state properly
    string result = "{\"step\":" + to_string(state.step) + 
                    ",\"totalSteps\":" + to_string(state.totalSteps) + 
                    ",\"message\":\"" + state.message + "\"}";
    
    // Allocate memory for the result that JavaScript can free later
    char* buffer = (char*)malloc(result.length() + 1);
    strcpy(buffer, result.c_str());
    return buffer;
}

// Free memory allocated for step data
extern "C" EMSCRIPTEN_KEEPALIVE void freeStepData(char* ptr) {
    free(ptr);
}

// Bind the C++ class and methods to JavaScript
EMSCRIPTEN_BINDINGS(bst_module) {
    class_<BinarySearchTree>("BinarySearchTree")
        .constructor()
        .function("insert", &BinarySearchTree::insert)
        .function("search", &BinarySearchTree::search)
        .function("getStepCount", &BinarySearchTree::getStepCount);
}

// Main function required for emscripten
int main() {
    // Initialize with some sample values
    bst.insert(50);
    bst.insert(25);
    bst.insert(75);
    bst.insert(15);
    return 0;
}
