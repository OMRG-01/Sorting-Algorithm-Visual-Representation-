const generateArrayBtn = document.getElementById("generateArray");
const startHeapSortBtn = document.getElementById("startHeapSort");
const extractBtn = document.getElementById("extractBtn");
const inputArrayDiv = document.getElementById("inputArray");
const sortedArrayDiv = document.getElementById("sortedArray");
const logMessagesDiv = document.getElementById("logMessages");
const clearBtn = document.getElementById("clearBtn");
const userInput = document.getElementById("userInput");
const applyUserArrayBtn = document.getElementById("applyUserArray");

const binaryTreeCanvas = document.getElementById("binaryTreeCanvas");
const heapifyCanvas = document.getElementById("heapifyCanvas");
const binaryTreeCtx = binaryTreeCanvas.getContext("2d");
const heapifyCtx = heapifyCanvas.getContext("2d");

binaryTreeCanvas.width = 600;
binaryTreeCanvas.height = 300;
heapifyCanvas.width = 600;
heapifyCanvas.height = 300;

let inputArray = [];
let sortedArray = [];
let isHeapified = false;



function logMessage(message) {
  const logEntry = document.createElement("div");
  logEntry.textContent = message;
  logMessagesDiv.appendChild(logEntry);
  logMessagesDiv.scrollTop = logMessagesDiv.scrollHeight;
}

function drawBinaryTree(array) {
  binaryTreeCtx.clearRect(0, 0, binaryTreeCanvas.width, binaryTreeCanvas.height);

  const nodeRadius = 15;
  const levelHeight = 60;
  const treeWidth = binaryTreeCanvas.width;

  for (let i = 0; i < array.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const levelNodes = Math.pow(2, level);
    const horizontalGap = treeWidth / (levelNodes + 1);
    const x = horizontalGap * ((i - Math.pow(2, level) + 1) + 1);
    const y = levelHeight * (level + 1);

    binaryTreeCtx.beginPath();
    binaryTreeCtx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    binaryTreeCtx.fillStyle = "#90e0ef";
    binaryTreeCtx.fill();
    binaryTreeCtx.stroke();

    binaryTreeCtx.fillStyle = "black";
    binaryTreeCtx.font = "14px Arial";
    binaryTreeCtx.textAlign = "center";
    binaryTreeCtx.textBaseline = "middle";
    binaryTreeCtx.fillText(array[i], x, y);

    if (i > 0) {
      const parentIndex = Math.floor((i - 1) / 2);
      const parentLevel = Math.floor(Math.log2(parentIndex + 1));
      const parentLevelNodes = Math.pow(2, parentLevel);
      const parentHorizontalGap = treeWidth / (parentLevelNodes + 1);
      const parentX =
        parentHorizontalGap * ((parentIndex - Math.pow(2, parentLevel) + 1) + 1);
      const parentY = levelHeight * (parentLevel + 1);

      binaryTreeCtx.beginPath();
      binaryTreeCtx.moveTo(x, y - nodeRadius);
      binaryTreeCtx.lineTo(parentX, parentY + nodeRadius);
      binaryTreeCtx.stroke();
    }
  }
}

function drawMaxHeap(array) {
  heapifyCtx.clearRect(0, 0, heapifyCanvas.width, heapifyCanvas.height);

  const nodeRadius = 15;
  const levelHeight = 60;

  for (let i = 0; i < array.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const positionInLevel = i - (Math.pow(2, level) - 1);
    const x = heapifyCanvas.width / (Math.pow(2, level) + 1) * (positionInLevel + 1);
    const y = levelHeight * (level + 1);

    heapifyCtx.beginPath();
    heapifyCtx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
    heapifyCtx.fillStyle = "#48CAE4";
    heapifyCtx.fill();
    heapifyCtx.stroke();

    heapifyCtx.fillStyle = "black";
    heapifyCtx.font = "16px Arial";
    heapifyCtx.textAlign = "center";
    heapifyCtx.textBaseline = "middle";
    heapifyCtx.fillText(array[i], x, y);

    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;
    if (leftChild < array.length) {
      const leftX = heapifyCanvas.width / (Math.pow(2, Math.floor(Math.log2(leftChild + 1))) + 1) * (leftChild - (Math.pow(2, Math.floor(Math.log2(leftChild + 1))) - 1) + 1);
      const leftY = levelHeight * (Math.floor(Math.log2(leftChild + 1)) + 1);
      heapifyCtx.beginPath();
      heapifyCtx.moveTo(x, y);
      heapifyCtx.lineTo(leftX, leftY);
      heapifyCtx.stroke();
    }
    if (rightChild < array.length) {
      const rightX = heapifyCanvas.width / (Math.pow(2, Math.floor(Math.log2(rightChild + 1))) + 1) * (rightChild - (Math.pow(2, Math.floor(Math.log2(rightChild + 1))) - 1) + 1);
      const rightY = levelHeight * (Math.floor(Math.log2(rightChild + 1)) + 1);
      heapifyCtx.beginPath();
      heapifyCtx.moveTo(x, y);
      heapifyCtx.lineTo(rightX, rightY);
      heapifyCtx.stroke();
    }
  }
  // Log the current state of the Max Heap after drawing it
  logMessage(`Max Heap updated: [${array.join(", ")}]`);
}

function heapifyDown(index, length) 
{
  const leftChild = 2 * index + 1;
  const rightChild = 2 * index + 2;
  let largest = index;

  if (leftChild < length && inputArray[leftChild] > inputArray[largest]) {
    largest = leftChild;
  }

  if (rightChild < length && inputArray[rightChild] > inputArray[largest]) {
    largest = rightChild;
  }

  if (largest !== index) 
  {
    [inputArray[index], inputArray[largest]] = [inputArray[largest], inputArray[index]];
    drawMaxHeap(inputArray);
    logMessage(`Swapped elements: ${inputArray[index]} and ${inputArray[largest]}`);
    heapifyDown(largest, length);
  }
}

function buildMaxHeap() {
  
  for (let i = Math.floor(inputArray.length / 2) - 1; i >= 0; i--) {
    heapifyDown(i, inputArray.length);
  }
   // After building the heap, log the final Max Heap
  logMessage(`Max Heap built: [${inputArray.join(", ")}]`);
  drawMaxHeap(inputArray, heapifyCtx); // Final Max Heap visualization
}

function extractRoot() {
  if (inputArray.length === 0) return;

  const rootValue = inputArray[0];
  inputArray[0] = inputArray.pop();
  sortedArray.unshift(rootValue); // Add root at the beginning for reverse order
  logMessage(`Extracted ${rootValue}`);
  heapifyDown(0, inputArray.length);
  drawMaxHeap(inputArray);
  displaySortedArray();
}

function displaySortedArray() 
{
  sortedArrayDiv.innerHTML = `Sorted Array : [${sortedArray.join(", ")}]`;
}

generateArrayBtn.addEventListener("click", () => {
  inputArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
  sortedArray = [];
  inputArrayDiv.innerHTML = `Input Array: [${inputArray.join(", ")}]`;
  displaySortedArray();
  drawBinaryTree(inputArray);
  isHeapified = false;
  startHeapSortBtn.disabled = false;
  extractBtn.disabled = true;
});

applyUserArrayBtn.addEventListener("click", () => {
  inputArray = userInput.value.split(",").map(Number).filter((num) => !isNaN(num));
  sortedArray = [];
  inputArrayDiv.innerHTML = `Input Array: [${inputArray.join(", ")}]`;
  displaySortedArray();
  drawBinaryTree(inputArray);
  isHeapified = false;
  startHeapSortBtn.disabled = false;
  extractBtn.disabled = true;
});

startHeapSortBtn.addEventListener("click", () => {
  buildMaxHeap();
  isHeapified = true;
  startHeapSortBtn.disabled = true;
  extractBtn.disabled = false;
});

extractBtn.addEventListener("click", () => {
  if (isHeapified) {
    extractRoot();
    if (inputArray.length === 0) {
      logMessage("Heap is empty. Sorting complete!");
      extractBtn.disabled = true;
    }
  }
});

function clearScreen() {
  // Clear input and sorted arrays
  inputArray = [];
  sortedArray = [];
  inputArrayDiv.innerHTML = "Input Array: []";
  displaySortedArray();

  // Clear the log messages
  logMessagesDiv.innerHTML = "";

  // Clear the canvases
  binaryTreeCtx.clearRect(0, 0, binaryTreeCanvas.width, binaryTreeCanvas.height);
  heapifyCtx.clearRect(0, 0, heapifyCanvas.width, heapifyCanvas.height);

  // Reset heapified state and disable extract button
  isHeapified = false;
  startHeapSortBtn.disabled = false;
  extractBtn.disabled = true;
}



clearBtn.addEventListener("click", clearScreen);
