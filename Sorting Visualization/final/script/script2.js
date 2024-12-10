const visualizer = document.getElementById('visualizer');
const randomArrayBtn = document.getElementById('randomArrayBtn');
const selectionSortBtn = document.getElementById('selectionSortBtn');
const customArrayInput = document.getElementById('customArrayInput');
const selectedAlgorithm = document.getElementById('selectedAlgorithm');
const historyBtn = document.getElementById('historyBtn');
const historySection = document.getElementById('history');
const historyContent = document.getElementById('historyContent');
const iterationDetails = document.getElementById('iterationDetails'); 

let array = [];
let history = [];

// random array is generated
randomArrayBtn.addEventListener('click', () => 
{
  array = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
  renderArray();//carry for visualization
  updateArrayType();
});

// custom array is input
customArrayInput.addEventListener('change', () => 
{
  const input = customArrayInput.value.split(',').map(Number);
  if (input.every(num => !isNaN(num))) 
  {
    array = input;
    renderArray();//carry for visualization
    updateArrayType();
  } 
  else 
  {
    alert('Please enter valid numbers, separated by commas.');
  }
});

// Render array as boxes
function renderArray() {
  visualizer.innerHTML = ''; // Clear existing visualizer
  array.forEach(value => 
  {
    const box = document.createElement('div');
    box.classList.add('box');
    box.textContent = value; // Display value inside the box
    visualizer.appendChild(box);
  });
}

// Swap array elements
async function swapElements(i, j) 
{
  const boxes = document.querySelectorAll('.box');
  boxes[i].textContent = '';
  boxes[j].textContent = '';

  await pause(500); // Delay to swap effect

  [array[i], array[j]] = [array[j], array[i]]; // Swap the values
  boxes[i].textContent = array[i];
  boxes[j].textContent = array[j];
}

// Perform selection sort
async function selectionSort() 
{
  const startTime = performance.now(); // Start time for measuring sorting time
  history = [];  // Clear history before starting a new sort
  iterationDetails.innerHTML = '';  // Clear iteration details section before starting

  for (let i = 0; i < array.length; i++) 
  {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++)
    {
      updateBoxColors(i, j, 'purple');
      if (array[j] < array[minIdx]) 
      {
        updateBoxColors(j, null, 'faint-purple');
        minIdx = j;
      }
      await pause(300); // Delay for the user to see the comparison
    }

    // Save the current iteration state to history
    history.push({
      array: [...array],
      selectedIdx: i,
      minIdx: minIdx
    });

    // Show iteration details below visualizer
    const iterationInfo = document.createElement('div');
    if(minIdx!=i)
    {
    iterationInfo.textContent = `Iteration ${i + 1}: Selected Element at index[${i}] with value ${array[i]} |
     Minimum Element at index[${minIdx}] with value ${array[minIdx]}`;
    }
    else
    {
      iterationInfo.textContent = `Iteration ${i + 1}: Selected Element at index[${i}] with value ${array[i]} | Minimum Element not Found`;
    }

    // Show swap details if swap happens
    if (minIdx !== i) 
    {
      iterationInfo.textContent += ` | Swap: index[${i}] and index[${minIdx}]`;
    }
    
    iterationDetails.appendChild(iterationInfo);

    // If the minimum index is different from the selected index, swap
    if (minIdx !== i) {
      await swapElements(i, minIdx);  // Swap the elements visually
    }

    // Mark the current element as sorted (green)
    updateBoxColors(i, null, 'green');
    renderArray(); // Update the DOM after each iteration
  }

  const endTime = performance.now(); // End time for measuring sorting time
  const timeTaken = (endTime - startTime).toFixed(2); // Time taken in milliseconds
  
  // Display the time taken and complexity in the DOM
  const timeComplexity = 'O(n²)';
  const spaceComplexity = 'O(1)';
  iterationDetails.innerHTML += `
    <div style="margin-top: 20px;">
      <strong>Time Taken to Sort: </strong>${timeTaken} ms
    </div>
    <div>
      <strong>Time Complexity: </strong>${timeComplexity}
    </div>
    <div>
      <strong>Space Complexity: </strong>${spaceComplexity}
    </div>
  `;
  renderArray(); // Re-render the sorted array after sorting is complete
}

// Update box colors for visualization
function updateBoxColors(i, j, color) 
{
  const boxes = document.querySelectorAll('.box');
  boxes.forEach((box, idx) => 
    {
    box.classList.remove('sky-blue', 'purple', 'faint-purple', 'green');
    if (idx === i) 
    {
      box.classList.add('sky-blue'); // Highlight selected element
    } 
    else if (idx === j) 
    {
      box.classList.add(color); // Highlight compared element with specified color
    } 
    else if (idx < i) 
    {
      box.classList.add('green'); // Green for sorted elements
    }
  });
}

// Display sorting history
historyBtn.addEventListener('click', () => 
{
  historyContent.innerHTML = '';  // Clear history content
  history.forEach((step, idx) => 
  {
    const stepDiv = document.createElement('div');
    const historyBoxContainer = document.createElement('div');

    stepDiv.textContent = `Iteration ${idx + 1}:`;  // Show the iteration number
    historyBoxContainer.classList.add('visualizer');

    // Render the array for the current iteration
    step.array.forEach((value, i) => {
      const box = document.createElement('div');
      box.classList.add('box');
      box.textContent = value;

      // Highlight the selected element in the current iteration (skyblue)
      if (i === step.selectedIdx) {
        box.style.backgroundColor = 'skyblue'; // Selected element
      }
      // Highlight the minimum element in the current iteration (rgb(202, 155, 233))
      else if (i === step.minIdx) {
        box.style.backgroundColor = 'rgb(202, 155, 233)'; // Minimum element
      }

      historyBoxContainer.appendChild(box);
    });

    // Append the step description and array visualization to the history content
    historyContent.appendChild(stepDiv);
    historyContent.appendChild(historyBoxContainer);
  });

  // Ensure historySection is visible
  historySection.classList.remove('hidden');  // Show history section
});

// Pause function for animation
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start selection sort on button click
selectionSortBtn.addEventListener('click', async () => 
{
  await selectionSort();  // Run the selection sort when the button is clicked
});


const arrayTypeDiv = document.getElementById('arrayType');
// Function to determine the array type
function determineArrayType(arr) 
{
  // Check if the array is sorted in ascending order
  const isSorted = arr.every((val, i, arr) => i === 0 || arr[i - 1] <= val);
  
  // Check if the array is sorted in descending order
  const isOppositeSorted = arr.every((val, i, arr) => i === 0 || arr[i - 1] >= val);

  // Check if the array is nearly sorted (1 swap away from being sorted)
  const nearlySorted = arr.filter((val, i, arr) => i === 0 || arr[i - 1] > val).length <= 2;

  if (isSorted) 
  {
    return 'Sorted List';
  } 
  else if (isOppositeSorted) 
  {
    return 'Opposite Sorted List';
  } 
  else if (nearlySorted) 
  {
    return 'Nearly Sorted List';
  } 
  else 
  {
    return 'Unsorted List';
  }
}

// Function to update the array type display
function updateArrayType() {
  const arrayType = determineArrayType(array);
  arrayTypeDiv.textContent = `Array Type: ${arrayType}`;
}
