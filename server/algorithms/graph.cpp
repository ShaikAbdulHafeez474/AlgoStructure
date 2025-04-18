// Graph algorithms implementation in C++

#include <iostream>
#include <vector>
#include <queue>
#include <stack>
#include <map>
#include <set>
#include <limits>
#include <algorithm>
#include <string>
#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

using namespace std;
using namespace emscripten;

// Type definitions for graph representation
using NodeId = int;
using Weight = int;

// Node structure for visualization
struct NodePosition {
    NodeId id;
    int value;
    double x;
    double y;
    bool highlighted;
};

// Edge structure for visualization
struct EdgePosition {
    NodeId source;
    NodeId target;
    Weight weight;
    bool highlighted;
};

// Structure to hold algorithm state
struct AlgorithmState {
    vector<NodePosition> nodes;
    vector<EdgePosition> edges;
    string message;
    int step;
    int totalSteps;
};

// Graph class with adjacency list representation
class Graph {
private:
    struct Edge {
        NodeId target;
        Weight weight;

        Edge(NodeId t, Weight w) : target(t), weight(w) {}
    };

    map<NodeId, vector<Edge>> adjacencyList;
    map<NodeId, pair<double, double>> nodePositions;
    int nextNodeId;
    vector<AlgorithmState> states;
    int currentStep;
    int totalSteps;

    // Calculate node positions (arrange in a grid or circular layout)
    void calculateNodePositions() {
        const int GRID_SIZE = 4; // For grid layout
        const double CENTER_X = 400; // Center of visualization
        const double CENTER_Y = 250;
        const double RADIUS = 150; // For circular layout
        
        if (adjacencyList.size() <= 1) {
            // Only one node, place in center
            for (auto& node : adjacencyList) {
                nodePositions[node.first] = make_pair(CENTER_X, CENTER_Y);
            }
            return;
        }
        
        // Choose layout based on number of nodes
        if (adjacencyList.size() <= 8) {
            // Circular layout for small graphs
            int i = 0;
            for (auto& node : adjacencyList) {
                double angle = 2 * M_PI * i / adjacencyList.size();
                double x = CENTER_X + RADIUS * cos(angle);
                double y = CENTER_Y + RADIUS * sin(angle);
                nodePositions[node.first] = make_pair(x, y);
                i++;
            }
        } else {
            // Grid layout for larger graphs
            int rows = ceil(sqrt(adjacencyList.size()));
            int cols = ceil(adjacencyList.size() / (double)rows);
            int i = 0;
            
            for (auto& node : adjacencyList) {
                int row = i / cols;
                int col = i % cols;
                double x = 100 + col * (600 / (cols - 1));
                double y = 80 + row * (400 / (rows - 1));
                nodePositions[node.first] = make_pair(x, y);
                i++;
            }
        }
    }

    // Create the initial state for visualization
    AlgorithmState createInitialState(const string& message) {
        AlgorithmState state;
        state.message = message;
        state.step = 1;
        
        // Make sure node positions are calculated
        if (nodePositions.empty() && !adjacencyList.empty()) {
            calculateNodePositions();
        }
        
        // Add nodes to state
        for (const auto& node : adjacencyList) {
            auto pos = nodePositions[node.first];
            state.nodes.push_back({node.first, node.first, pos.first, pos.second, false});
        }
        
        // Add edges to state
        for (const auto& node : adjacencyList) {
            for (const auto& edge : node.second) {
                state.edges.push_back({node.first, edge.target, edge.weight, false});
            }
        }
        
        return state;
    }

public:
    Graph() : nextNodeId(0), currentStep(0), totalSteps(0) {}

    // Add a node to the graph
    NodeId addNode() {
        NodeId id = nextNodeId++;
        adjacencyList[id] = vector<Edge>();
        // Position will be calculated when needed
        return id;
    }

    // Add an edge between nodes
    void addEdge(NodeId source, NodeId target, Weight weight = 1) {
        if (adjacencyList.find(source) != adjacencyList.end() && 
            adjacencyList.find(target) != adjacencyList.end()) {
            adjacencyList[source].push_back(Edge(target, weight));
            // For undirected graph, add the reverse edge
            adjacencyList[target].push_back(Edge(source, weight));
        }
    }

    // Depth-First Search implementation
    void depthFirstSearch(NodeId startNode) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState = createInitialState("Starting DFS from node " + to_string(startNode));
        states.push_back(initialState);
        
        // Track visited nodes
        set<NodeId> visited;
        stack<NodeId> nodeStack;
        vector<pair<NodeId, NodeId>> traversalEdges; // (source, target) pairs
        
        nodeStack.push(startNode);
        
        while (!nodeStack.empty()) {
            NodeId current = nodeStack.top();
            nodeStack.pop();
            
            if (visited.find(current) != visited.end()) {
                continue;
            }
            
            visited.insert(current);
            
            // Create a state for this node visit
            AlgorithmState state = initialState;
            state.step = states.size() + 1;
            state.message = "Visiting node " + to_string(current);
            
            // Highlight the current node
            for (auto& node : state.nodes) {
                node.highlighted = (node.id == current);
            }
            
            // Highlight edges in the traversal path
            for (auto& edge : state.edges) {
                for (const auto& tEdge : traversalEdges) {
                    if (edge.source == tEdge.first && edge.target == tEdge.second) {
                        edge.highlighted = true;
                    }
                }
            }
            
            states.push_back(state);
            
            // Add neighbors to stack in reverse order (to visit in original order)
            vector<Edge> neighbors = adjacencyList[current];
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                NodeId neighbor = neighbors[i].target;
                if (visited.find(neighbor) == visited.end()) {
                    nodeStack.push(neighbor);
                    traversalEdges.push_back(make_pair(current, neighbor));
                }
            }
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "DFS traversal complete";
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }

    // Breadth-First Search implementation
    void breadthFirstSearch(NodeId startNode) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState = createInitialState("Starting BFS from node " + to_string(startNode));
        states.push_back(initialState);
        
        // Track visited nodes
        set<NodeId> visited;
        queue<NodeId> nodeQueue;
        vector<pair<NodeId, NodeId>> traversalEdges; // (source, target) pairs
        
        visited.insert(startNode);
        nodeQueue.push(startNode);
        
        while (!nodeQueue.empty()) {
            NodeId current = nodeQueue.front();
            nodeQueue.pop();
            
            // Create a state for this node visit
            AlgorithmState state = initialState;
            state.step = states.size() + 1;
            state.message = "Visiting node " + to_string(current);
            
            // Highlight the current node
            for (auto& node : state.nodes) {
                node.highlighted = (node.id == current);
            }
            
            // Highlight edges in the traversal path
            for (auto& edge : state.edges) {
                for (const auto& tEdge : traversalEdges) {
                    if (edge.source == tEdge.first && edge.target == tEdge.second) {
                        edge.highlighted = true;
                    }
                }
            }
            
            states.push_back(state);
            
            // Add all neighbors to queue
            for (const auto& edge : adjacencyList[current]) {
                NodeId neighbor = edge.target;
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    nodeQueue.push(neighbor);
                    traversalEdges.push_back(make_pair(current, neighbor));
                }
            }
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "BFS traversal complete";
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }

    // Dijkstra's algorithm implementation
    void dijkstraAlgorithm(NodeId startNode) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState = createInitialState("Starting Dijkstra's algorithm from node " + to_string(startNode));
        states.push_back(initialState);
        
        // Initialize distances with infinity
        map<NodeId, int> distances;
        map<NodeId, NodeId> previous;
        set<NodeId> unvisited;
        
        for (const auto& node : adjacencyList) {
            distances[node.first] = numeric_limits<int>::max();
            unvisited.insert(node.first);
        }
        
        distances[startNode] = 0;
        
        while (!unvisited.empty()) {
            // Find the unvisited node with minimum distance
            NodeId current = *unvisited.begin();
            for (const auto& node : unvisited) {
                if (distances[node] < distances[current]) {
                    current = node;
                }
            }
            
            // If we've reached a node with infinite distance, we're done
            if (distances[current] == numeric_limits<int>::max()) {
                break;
            }
            
            // Create a state for this node visit
            AlgorithmState state = initialState;
            state.step = states.size() + 1;
            state.message = "Processing node " + to_string(current) + " with distance " + to_string(distances[current]);
            
            // Highlight the current node and its path
            for (auto& node : state.nodes) {
                if (node.id == current) {
                    node.highlighted = true;
                }
            }
            
            // Highlight the shortest path edges found so far
            for (auto& edge : state.edges) {
                NodeId to = edge.target;
                if (previous.find(to) != previous.end() && previous[to] == edge.source) {
                    edge.highlighted = true;
                }
            }
            
            states.push_back(state);
            
            // Remove the current node from unvisited
            unvisited.erase(current);
            
            // Check all neighbors
            for (const auto& edge : adjacencyList[current]) {
                NodeId neighbor = edge.target;
                int alt = distances[current] + edge.weight;
                
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = current;
                    
                    // Create a state for this relaxation
                    AlgorithmState relaxState = state;
                    relaxState.step = states.size() + 1;
                    relaxState.message = "Updated distance to node " + to_string(neighbor) + " to " + to_string(alt);
                    
                    // Highlight the edge being relaxed
                    for (auto& e : relaxState.edges) {
                        if (e.source == current && e.target == neighbor) {
                            e.highlighted = true;
                        }
                    }
                    
                    states.push_back(relaxState);
                }
            }
        }
        
        // Final state
        AlgorithmState finalState = states.back();
        finalState.step = states.size() + 1;
        finalState.message = "Dijkstra's algorithm complete";
        
        // Highlight all shortest paths
        for (auto& edge : finalState.edges) {
            NodeId to = edge.target;
            if (previous.find(to) != previous.end() && previous[to] == edge.source) {
                edge.highlighted = true;
            }
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

    // Create a demo graph
    void createDemoGraph() {
        // Clear existing graph
        adjacencyList.clear();
        nodePositions.clear();
        nextNodeId = 0;
        
        // Add nodes
        for (int i = 0; i < 6; i++) {
            addNode();
        }
        
        // Add edges (undirected)
        addEdge(0, 1, 4);
        addEdge(0, 2, 2);
        addEdge(1, 2, 5);
        addEdge(1, 3, 10);
        addEdge(2, 3, 3);
        addEdge(2, 4, 7);
        addEdge(3, 4, 4);
        addEdge(3, 5, 6);
        addEdge(4, 5, 1);
        
        // Calculate positions
        calculateNodePositions();
    }
};

// Global instance of Graph
Graph graph;

// External interface functions

// Perform an operation on the Graph
extern "C" EMSCRIPTEN_KEEPALIVE int performGraphOperation(int algorithm, int startNode) {
    // Create a demo graph if not initialized
    if (graph.getStepCount() == 0) {
        graph.createDemoGraph();
    }
    
    switch (algorithm) {
        case 0: // DFS
            graph.depthFirstSearch(startNode);
            break;
        case 1: // BFS
            graph.breadthFirstSearch(startNode);
            break;
        case 2: // Dijkstra
            graph.dijkstraAlgorithm(startNode);
            break;
        // Other algorithms can be added here
        default:
            return -1;
    }
    return graph.getStepCount();
}

// Get the number of steps in the current operation
extern "C" EMSCRIPTEN_KEEPALIVE int getGraphStepCount() {
    return graph.getStepCount();
}

// Get a specific step's data
extern "C" EMSCRIPTEN_KEEPALIVE char* getGraphStepData(int step) {
    AlgorithmState state = graph.getStep(step);
    
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
extern "C" EMSCRIPTEN_KEEPALIVE void freeGraphStepData(char* ptr) {
    free(ptr);
}

// Bind the C++ class and methods to JavaScript
EMSCRIPTEN_BINDINGS(graph_module) {
    class_<Graph>("Graph")
        .constructor()
        .function("addNode", &Graph::addNode)
        .function("addEdge", &Graph::addEdge)
        .function("depthFirstSearch", &Graph::depthFirstSearch)
        .function("breadthFirstSearch", &Graph::breadthFirstSearch)
        .function("dijkstraAlgorithm", &Graph::dijkstraAlgorithm)
        .function("getStepCount", &Graph::getStepCount)
        .function("createDemoGraph", &Graph::createDemoGraph);
}

// Main function required for emscripten
int main() {
    // Create a demo graph
    graph.createDemoGraph();
    return 0;
}
