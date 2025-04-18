// Sorting algorithms implementation in C++

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>
#include <emscripten/bind.h>
#include <emscripten/emscripten.h>

using namespace std;
using namespace emscripten;

// Array element visualization
struct ArrayElement {
    int id;
    int value;
    double x;
    double y;
    bool highlighted;
    bool swapping;
};

// Structure to hold algorithm state
struct AlgorithmState {
    vector<ArrayElement> elements;
    string message;
    int step;
    int totalSteps;
};

// Sorting algorithms class
class SortingAlgorithms {
private:
    vector<AlgorithmState> states;
    int currentStep;
    int totalSteps;
    
    // Helper function to create array visualization
    void createArrayVisualization(vector<ArrayElement>& elements, const vector<int>& arr, 
                                 int highlight1 = -1, int highlight2 = -1, bool swapping = false) {
        elements.clear();
        const int barWidth = 40;
        const int barSpacing = 10;
        const int startX = 50;
        const int baseY = 300;
        const double heightScale = 2.0; // Scale factor for bar height
        
        for (int i = 0; i < arr.size(); i++) {
            ArrayElement element;
            element.id = i;
            element.value = arr[i];
            element.x = startX + i * (barWidth + barSpacing);
            element.y = baseY - arr[i] * heightScale; // Height based on value
            element.highlighted = (i == highlight1 || i == highlight2);
            element.swapping = swapping && (i == highlight1 || i == highlight2);
            elements.push_back(element);
        }
    }
    
    // Generate steps for QuickSort
    void quickSortSteps(vector<int>& arr, int low, int high) {
        if (low < high) {
            // Create a state for the current segment
            AlgorithmState segmentState;
            segmentState.step = states.size() + 1;
            segmentState.message = "Sorting segment [" + to_string(low) + " to " + to_string(high) + "]";
            createArrayVisualization(segmentState.elements, arr, low, high);
            states.push_back(segmentState);
            
            // Partition the array
            int pivot = arr[high];
            int i = low - 1;
            
            // Create a state for the pivot selection
            AlgorithmState pivotState;
            pivotState.step = states.size() + 1;
            pivotState.message = "Pivot: " + to_string(pivot) + " (index " + to_string(high) + ")";
            createArrayVisualization(pivotState.elements, arr, high);
            states.push_back(pivotState);
            
            for (int j = low; j <= high - 1; j++) {
                // Create a state for comparing with pivot
                AlgorithmState compareState;
                compareState.step = states.size() + 1;
                compareState.message = "Compare " + to_string(arr[j]) + " with pivot " + to_string(pivot);
                createArrayVisualization(compareState.elements, arr, j, high);
                states.push_back(compareState);
                
                if (arr[j] < pivot) {
                    i++;
                    
                    // Create a state for swapping
                    AlgorithmState swapState;
                    swapState.step = states.size() + 1;
                    swapState.message = "Swap " + to_string(arr[i]) + " and " + to_string(arr[j]);
                    createArrayVisualization(swapState.elements, arr, i, j, true);
                    states.push_back(swapState);
                    
                    // Perform the swap
                    swap(arr[i], arr[j]);
                    
                    // Create a state after swapping
                    AlgorithmState afterSwapState;
                    afterSwapState.step = states.size() + 1;
                    afterSwapState.message = "After swap";
                    createArrayVisualization(afterSwapState.elements, arr, i, j);
                    states.push_back(afterSwapState);
                }
            }
            
            // Swap arr[i+1] and arr[high] (the pivot)
            AlgorithmState swapPivotState;
            swapPivotState.step = states.size() + 1;
            swapPivotState.message = "Swap " + to_string(arr[i+1]) + " and pivot " + to_string(arr[high]);
            createArrayVisualization(swapPivotState.elements, arr, i+1, high, true);
            states.push_back(swapPivotState);
            
            swap(arr[i+1], arr[high]);
            
            AlgorithmState afterPivotState;
            afterPivotState.step = states.size() + 1;
            afterPivotState.message = "After placing pivot at position " + to_string(i+1);
            createArrayVisualization(afterPivotState.elements, arr, i+1);
            states.push_back(afterPivotState);
            
            int pi = i + 1;
            
            // Recursively sort the sub-arrays
            quickSortSteps(arr, low, pi - 1);
            quickSortSteps(arr, pi + 1, high);
        }
    }
    
    // Helper for merge sort
    void mergeSteps(vector<int>& arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        // Create temporary arrays
        vector<int> L(n1), R(n2);
        
        // Create a state for copying to temp arrays
        AlgorithmState copyState;
        copyState.step = states.size() + 1;
        copyState.message = "Copying elements to temporary arrays";
        createArrayVisualization(copyState.elements, arr, left, right);
        states.push_back(copyState);
        
        // Copy data to temp arrays L[] and R[]
        for (int i = 0; i < n1; i++)
            L[i] = arr[left + i];
        for (int j = 0; j < n2; j++)
            R[j] = arr[mid + 1 + j];
        
        // Merge the temp arrays back into arr[left..right]
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            // Create a state for comparing elements
            AlgorithmState compareState;
            compareState.step = states.size() + 1;
            compareState.message = "Compare " + to_string(L[i]) + " and " + to_string(R[j]);
            createArrayVisualization(compareState.elements, arr, left + i, mid + 1 + j);
            states.push_back(compareState);
            
            if (L[i] <= R[j]) {
                // Create a state for placing element from L
                AlgorithmState placeState;
                placeState.step = states.size() + 1;
                placeState.message = "Place " + to_string(L[i]) + " at position " + to_string(k);
                arr[k] = L[i];
                createArrayVisualization(placeState.elements, arr, k);
                states.push_back(placeState);
                i++;
            } else {
                // Create a state for placing element from R
                AlgorithmState placeState;
                placeState.step = states.size() + 1;
                placeState.message = "Place " + to_string(R[j]) + " at position " + to_string(k);
                arr[k] = R[j];
                createArrayVisualization(placeState.elements, arr, k);
                states.push_back(placeState);
                j++;
            }
            k++;
        }
        
        // Copy remaining elements of L[]
        while (i < n1) {
            // Create a state for copying remaining elements
            AlgorithmState copyRemState;
            copyRemState.step = states.size() + 1;
            copyRemState.message = "Copy remaining element " + to_string(L[i]) + " from left array";
            arr[k] = L[i];
            createArrayVisualization(copyRemState.elements, arr, k);
            states.push_back(copyRemState);
            i++;
            k++;
        }
        
        // Copy remaining elements of R[]
        while (j < n2) {
            // Create a state for copying remaining elements
            AlgorithmState copyRemState;
            copyRemState.step = states.size() + 1;
            copyRemState.message = "Copy remaining element " + to_string(R[j]) + " from right array";
            arr[k] = R[j];
            createArrayVisualization(copyRemState.elements, arr, k);
            states.push_back(copyRemState);
            j++;
            k++;
        }
    }
    
    // Generate steps for MergeSort
    void mergeSortSteps(vector<int>& arr, int left, int right) {
        if (left < right) {
            // Create a state for the current segment
            AlgorithmState segmentState;
            segmentState.step = states.size() + 1;
            segmentState.message = "Sorting segment [" + to_string(left) + " to " + to_string(right) + "]";
            createArrayVisualization(segmentState.elements, arr, left, right);
            states.push_back(segmentState);
            
            // Find the middle point
            int mid = left + (right - left) / 2;
            
            // Create a state for splitting
            AlgorithmState splitState;
            splitState.step = states.size() + 1;
            splitState.message = "Split into [" + to_string(left) + " to " + to_string(mid) + "] and [" +
                               to_string(mid+1) + " to " + to_string(right) + "]";
            createArrayVisualization(splitState.elements, arr);
            states.push_back(splitState);
            
            // Recursively sort first and second halves
            mergeSortSteps(arr, left, mid);
            mergeSortSteps(arr, mid + 1, right);
            
            // Merge the sorted halves
            mergeSteps(arr, left, mid, right);
        }
    }
    
    // Helper for heapify
    void heapifySteps(vector<int>& arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        // Create a state for the current subtree
        AlgorithmState subtreeState;
        subtreeState.step = states.size() + 1;
        subtreeState.message = "Heapifying subtree rooted at index " + to_string(i);
        createArrayVisualization(subtreeState.elements, arr, i);
        states.push_back(subtreeState);
        
        // If left child is larger than root
        if (left < n) {
            // Create a state for comparing with left child
            AlgorithmState compareLeftState;
            compareLeftState.step = states.size() + 1;
            compareLeftState.message = "Compare " + to_string(arr[i]) + " with left child " + to_string(arr[left]);
            createArrayVisualization(compareLeftState.elements, arr, i, left);
            states.push_back(compareLeftState);
            
            if (arr[left] > arr[largest])
                largest = left;
        }
        
        // If right child is larger than largest so far
        if (right < n) {
            // Create a state for comparing with right child
            AlgorithmState compareRightState;
            compareRightState.step = states.size() + 1;
            compareRightState.message = "Compare " + to_string(arr[largest]) + " with right child " + to_string(arr[right]);
            createArrayVisualization(compareRightState.elements, arr, largest, right);
            states.push_back(compareRightState);
            
            if (arr[right] > arr[largest])
                largest = right;
        }
        
        // If largest is not root
        if (largest != i) {
            // Create a state for swapping
            AlgorithmState swapState;
            swapState.step = states.size() + 1;
            swapState.message = "Swap " + to_string(arr[i]) + " and " + to_string(arr[largest]);
            createArrayVisualization(swapState.elements, arr, i, largest, true);
            states.push_back(swapState);
            
            swap(arr[i], arr[largest]);
            
            // Create a state after swapping
            AlgorithmState afterSwapState;
            afterSwapState.step = states.size() + 1;
            afterSwapState.message = "After swap";
            createArrayVisualization(afterSwapState.elements, arr, i, largest);
            states.push_back(afterSwapState);
            
            // Recursively heapify the affected sub-tree
            heapifySteps(arr, n, largest);
        }
    }
    
    // Generate steps for HeapSort
    void heapSortSteps(vector<int>& arr) {
        int n = arr.size();
        
        // Create a state for the initial array
        AlgorithmState initialState;
        initialState.step = states.size() + 1;
        initialState.message = "Building heap (rearranging array)";
        createArrayVisualization(initialState.elements, arr);
        states.push_back(initialState);
        
        // Build heap (rearrange array)
        for (int i = n / 2 - 1; i >= 0; i--)
            heapifySteps(arr, n, i);
        
        // Create a state after building the heap
        AlgorithmState heapState;
        heapState.step = states.size() + 1;
        heapState.message = "Heap built successfully";
        createArrayVisualization(heapState.elements, arr);
        states.push_back(heapState);
        
        // One by one extract an element from heap
        for (int i = n - 1; i > 0; i--) {
            // Create a state for extracting the root
            AlgorithmState extractState;
            extractState.step = states.size() + 1;
            extractState.message = "Move root " + to_string(arr[0]) + " to end";
            createArrayVisualization(extractState.elements, arr, 0, i, true);
            states.push_back(extractState);
            
            // Move current root to end
            swap(arr[0], arr[i]);
            
            // Create a state after moving root
            AlgorithmState afterMoveState;
            afterMoveState.step = states.size() + 1;
            afterMoveState.message = "After moving root, re-heapify remaining heap";
            createArrayVisualization(afterMoveState.elements, arr, 0, i);
            states.push_back(afterMoveState);
            
            // Call max heapify on the reduced heap
            heapifySteps(arr, i, 0);
        }
    }

public:
    SortingAlgorithms() : currentStep(0), totalSteps(0) {}
    
    // QuickSort driver
    void quickSort(vector<int>& arr) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.step = 1;
        initialState.message = "Initial array for QuickSort";
        createArrayVisualization(initialState.elements, arr);
        states.push_back(initialState);
        
        // Call recursive function to generate steps
        quickSortSteps(arr, 0, arr.size() - 1);
        
        // Final state
        AlgorithmState finalState;
        finalState.step = states.size() + 1;
        finalState.message = "Array sorted with QuickSort";
        createArrayVisualization(finalState.elements, arr);
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // MergeSort driver
    void mergeSort(vector<int>& arr) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.step = 1;
        initialState.message = "Initial array for MergeSort";
        createArrayVisualization(initialState.elements, arr);
        states.push_back(initialState);
        
        // Call recursive function to generate steps
        mergeSortSteps(arr, 0, arr.size() - 1);
        
        // Final state
        AlgorithmState finalState;
        finalState.step = states.size() + 1;
        finalState.message = "Array sorted with MergeSort";
        createArrayVisualization(finalState.elements, arr);
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // HeapSort driver
    void heapSort(vector<int>& arr) {
        states.clear();
        
        // Create initial state
        AlgorithmState initialState;
        initialState.step = 1;
        initialState.message = "Initial array for HeapSort";
        createArrayVisualization(initialState.elements, arr);
        states.push_back(initialState);
        
        // Call function to generate steps
        heapSortSteps(arr);
        
        // Final state
        AlgorithmState finalState;
        finalState.step = states.size() + 1;
        finalState.message = "Array sorted with HeapSort";
        createArrayVisualization(finalState.elements, arr);
        states.push_back(finalState);
        
        // Set total steps
        totalSteps = states.size();
        currentStep = 0;
        
        // Update all states with total steps
        for (auto& state : states) {
            state.totalSteps = totalSteps;
        }
    }
    
    // Generate a random array for sorting
    vector<int> generateRandomArray(int size, int minVal, int maxVal) {
        vector<int> arr(size);
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(minVal, maxVal);
        
        for (int i = 0; i < size; i++) {
            arr[i] = dis(gen);
        }
        
        return arr;
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
SortingAlgorithms sorting;

// External interface functions

// Perform a sorting operation
extern "C" EMSCRIPTEN_KEEPALIVE int performSortingOperation(int algorithm, int arraySize) {
    // Generate a random array
    vector<int> arr = sorting.generateRandomArray(arraySize > 0 ? arraySize : 10, 10, 100);
    
    switch (algorithm) {
        case 0: // QuickSort
            sorting.quickSort(arr);
            break;
        case 1: // MergeSort
            sorting.mergeSort(arr);
            break;
        case 2: // HeapSort
            sorting.heapSort(arr);
            break;
        default:
            return -1;
    }
    return sorting.getStepCount();
}

// Get the number of steps in the current operation
extern "C" EMSCRIPTEN_KEEPALIVE int getSortingStepCount() {
    return sorting.getStepCount();
}

// Get a specific step's data
extern "C" EMSCRIPTEN_KEEPALIVE char* getSortingStepData(int step) {
    AlgorithmState state = sorting.getStep(step);
    
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
extern "C" EMSCRIPTEN_KEEPALIVE void freeSortingStepData(char* ptr) {
    free(ptr);
}

// Bind the C++ class and methods to JavaScript
EMSCRIPTEN_BINDINGS(sorting_module) {
    class_<SortingAlgorithms>("SortingAlgorithms")
        .constructor()
        .function("quickSort", &SortingAlgorithms::quickSort)
        .function("mergeSort", &SortingAlgorithms::mergeSort)
        .function("heapSort", &SortingAlgorithms::heapSort)
        .function("getStepCount", &SortingAlgorithms::getStepCount)
        .function("generateRandomArray", &SortingAlgorithms::generateRandomArray);
}

// Main function required for emscripten
int main() {
    // Create and sort a sample array
    vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
    sorting.quickSort(arr);
    return 0;
}
