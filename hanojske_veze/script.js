let towers = {
  tower1: [],
  tower2: [7, 6, 5, 4, 3, 2, 1],
  tower3: [],
};

let moveCount = 0;
let startTime = null;
let currentTime = 0;
let timerInterval = null;
let gameStarted = false;

let selectedDisk = null;
let selectedTower = null;

let bestTime = localStorage.getItem("bestTime");
let bestMoves = localStorage.getItem("bestMoves");

function initGame() {
  document.querySelectorAll("td").forEach((tower) => {
    tower.addEventListener("click", handleTowerClick);
  });
  updateDisplay();
}

function handleTowerClick(event) {
  const towerId = event.currentTarget.id;

  // First click - selecting a disk
  if (!selectedDisk) {
    if (towers[towerId].length > 0) {
      startGame();
      selectedDisk = towers[towerId][towers[towerId].length - 1];
      selectedTower = towerId;
      highlightTower(towerId);
    }
  }
  // Second click - moving the disk
  else {
    // If clicking the same tower, deselect
    if (towerId === selectedTower) {
      selectedDisk = null;
      selectedTower = null;
      removeHighlight();
    }
    // If clicking different tower, try to move disk
    else {
      if (isValidMove(selectedDisk, towers[towerId])) {
        // Remove disk from source tower
        const disk = towers[selectedTower].pop();
        // Add disk to target tower
        towers[towerId].push(disk);
        moveCount++;

        // Reset selection
        selectedDisk = null;
        selectedTower = null;
        removeHighlight();

        // Update display and check for win
        updateDisplay();
        updateStats();
        checkWin();
      }
    }
  }
}

function isValidMove(disk, targetTower) {
  if (targetTower.length === 0) return true;
  return disk < targetTower[targetTower.length - 1];
}

function updateDisplay() {
  for (let towerId in towers) {
    const towerElement = document.getElementById(towerId);
    towerElement.innerHTML = "";
    towerElement.innerHTML += `
      <a><img src="images/vrchol.png" alt="Top_of_Tower"></a><br>
    `;

    for (let i = 0; i < 7 - towers[towerId].length; i++) {
      towerElement.innerHTML += `
        <a><img src="images/prubeh.png" alt="Tower_rod"></a><br>
      `;
    }

    for (let i = towers[towerId].length - 1; i >= 0; i--) {
      const diskSize = towers[towerId][i];
      towerElement.innerHTML += `
        <a><img src="images/disk${diskSize}.png" alt="Disk_${diskSize}"></a><br>
      `;
    }
  }

  document.querySelectorAll("td").forEach((tower) => {
    tower.addEventListener("click", handleTowerClick);
  });

  // Restore tower highlight after DOM update
  if (selectedTower) {
    highlightTower(selectedTower);
  }
}

function highlightTower(towerId) {
  removeHighlight();
  const towerElement = document.getElementById(towerId);
  if (towerElement) {
    towerElement.classList.add("selected-tower");
  }
}

function removeHighlight() {
  document.querySelectorAll("td").forEach((tower) => {
    tower.classList.remove("selected-tower");
  });
}

function checkWin() {
  if (
    towers.tower3.length === 7 &&
    JSON.stringify(towers.tower3) === JSON.stringify([7, 6, 5, 4, 3, 2, 1])
  ) {
    const endTime = new Date();
    const timeElapsed = Math.floor((endTime - startTime) / 1000);

    if (!bestTime || timeElapsed < bestTime) {
      bestTime = timeElapsed;
      localStorage.setItem("bestTime", bestTime);
    }

    if (!bestMoves || moveCount < bestMoves) {
      bestMoves = moveCount;
      localStorage.setItem("bestMoves", bestMoves);
    }

    clearInterval(timerInterval); // Stop timer when game is won
    gameStarted = false;

    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    alert(
      `Congratulations! You won!\nTime: ${minutes}:${seconds
        .toString()
        .padStart(2, "0")}\nMoves: ${moveCount}`
    );
    updateStats();
  }
}

function restartGame() {
  clearInterval(timerInterval);
  towers = {
    tower1: [],
    tower2: [7, 6, 5, 4, 3, 2, 1],
    tower3: [],
  };
  moveCount = 0;
  startTime = null;
  gameStarted = false;
  currentTime = 0;
  selectedDisk = null;
  selectedTower = null;
  updateDisplay();
  updateStats();
  document.getElementById("currentTime").textContent = "--:--";
}

function updateStats() {
  document.getElementById("currentMoves").textContent = moveCount;
  document.getElementById("bestMoves").textContent = bestMoves || "-";
  if (bestTime) {
    const minutes = Math.floor(bestTime / 60);
    const seconds = bestTime % 60;
    document.getElementById("bestTime").textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  } else {
    document.getElementById("bestTime").textContent = "--:--";
  }
}

function updateTimer() {
  if (!startTime || !gameStarted) return;

  const now = new Date();
  currentTime = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(currentTime / 60);
  const seconds = currentTime % 60;
  document.getElementById("currentTime").textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    startTime = new Date();
    timerInterval = setInterval(updateTimer, 1000);
  }
}

window.onload = () => {
  initGame();
  updateDisplay();
  updateStats();
};
