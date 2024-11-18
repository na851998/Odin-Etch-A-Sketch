const sliderValue = document.querySelector("#value");
const slider = document.querySelector("#sketch-size");
const screen = document.querySelector(".sketch-screen");
const clearBtn = document.querySelector("#clear");
const randomBtn = document.querySelector("#random-color");
const colorPicker = document.querySelector("#favcolor");
const controlPallete = document.querySelector(".settings");

// Init
sliderValue.textContent = slider.value;
screen.appendChild(createSketchScreen(slider.value));
changePainterColor(() => "black");
controlPallete.setAttribute("style", "display:flex; flex-direction:column");

// Show selected button depending on modes
let currentMode = "color";

function activateButton(newMode) {
  if (currentMode === "rainbow") {
    randomBtn.classList.remove("active");
  } else if (currentMode === "clear") {
    clearBtn.classList.remove("active");
  }

  currentMode = newMode;

  if (newMode === "rainbow") {
    randomBtn.classList.add("active");
  } else if (newMode === "clear") {
    clearBtn.classList.add("active");
  }
}

// Color picker
colorPicker.addEventListener("input", (e) => {
  changePainterColor(() => e.target.value);
});

colorPicker.addEventListener("click", (e) => {
  changePainterColor(() => e.target.value);
  activateButton("color");
});

// Random color
randomBtn.addEventListener("click", () => {
  changePainterColor(getRandomColor);
  activateButton("rainbow");
});

function changePainterColor(getColor) {
  // Add events to change color of cells when hovered and mousedown
  screen.addEventListener("mouseover", (e) => {
    let cell = e.target;

    if (cell != screen && e.buttons === 1) {
      cell.setAttribute("style", `background:${getColor()}`);
    }
  });

  // Add events to change color of cells when mousedown
  screen.addEventListener("mousedown", (e) => {
    let cell = e.target;

    if (cell != screen) {
      cell.setAttribute("style", `background:${getColor()}`);
    }
  });
}

// Change background color to white when clear is clicked
clearBtn.addEventListener("click", () => {
  changeCellStyle((cell) => {
    cell.setAttribute("style", "background:white");
  });
  activateButton("clear");
});

function changeCellStyle(callback) {
  let allCells = screen.querySelectorAll(".square-div");
  [...allCells].forEach((cell) => {
    callback(cell);
  });
}

// Debounce input so sketch screen size do not change rapidly
let debounceTimer;
slider.addEventListener("input", () => {
  sliderValue.textContent = slider.value;

  // Debounce input to create sketch screen
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    screen.textContent = "";
    screen.appendChild(createSketchScreen(slider.value));
  });
});

function createSketchScreen(size) {
  // Create a nxn sketch screen
  let grid = document.createElement("div");
  grid.classList.add("grid");

  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const gridElement = document.createElement("div");
    gridElement.setAttribute("class", "square-div");
    grid.appendChild(gridElement);
  }

  return grid;
}

function getRandomColor() {
  var color = "rgb(";
  for (var i = 0; i < 3; i++) {
    color += Math.floor(Math.random() * 256) + ",";
  }
  return color.slice(0, -1) + ")";
}
