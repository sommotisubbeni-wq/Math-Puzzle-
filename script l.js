let levelsData = [];
let currentLevel = 1;

fetch("levels.json")
  .then(res => res.json())
  .then(data => {
    levelsData = data.levels;
    loadLevel(currentLevel);
  });

function loadLevel(levelId) {
  const level = levelsData.find(l => l.id === levelId);
  if (!level) {
    document.getElementById("puzzle").innerHTML = "🎉 All levels complete!";
    return;
  }

  const puzzleDiv = document.getElementById("puzzle");
  const numbersDiv = document.getElementById("numbers");
  const title = document.getElementById("levelTitle");
  const message = document.getElementById("message");
  const nextBtn = document.getElementById("nextBtn");

  puzzleDiv.innerHTML = "";
  numbersDiv.innerHTML = "";
  message.innerHTML = "";
  nextBtn.style.display = "none";

  title.textContent = `Level ${level.id} (${level.difficulty})`;

  // Build puzzle
  level.equations.forEach(eq => {
    const row = document.createElement("div");
    row.classList.add("equation");

    eq.expr.forEach(symbol => {
      if (symbol === "□") {
        const blank = document.createElement("div");
        blank.classList.add("blank");
        blank.dataset.answer = eq.answer.shift();
        blank.addEventListener("dragover", e => e.preventDefault());
        blank.addEventListener("drop", drop);

        // touch support
        blank.addEventListener("touchstart", e => e.preventDefault());
        blank.addEventListener("touchend", touchDrop);

        row.appendChild(blank);
      } else {
        const span = document.createElement("span");
        span.textContent = symbol;
        row.appendChild(span);
      }
    });
    puzzleDiv.appendChild(row);
  });

  // Numbers to drag
  level.numbers.forEach(num => {
    const tile = document.createElement("div");
    tile.classList.add("number");
    tile.textContent = num;
    tile.draggable = true;
    tile.addEventListener("dragstart", drag);

    // touch support
    tile.addEventListener("touchstart", touchDrag);

    numbersDiv.appendChild(tile);
  });
}

function drag(e) {
  e.dataTransfer.setData("text", e.target.textContent);
}

function drop(e) {
  e.preventDefault();
  if (!e.target.textContent) {
    const num = e.dataTransfer.getData("text");
    e.target.textContent = num;
    checkWin();
  }
}

// --- Touch Drag & Drop Support ---
let draggedNumber = null;

function touchDrag(e) {
  draggedNumber = e.target.textContent;
}

function touchDrop(e) {
  if (!e.target.textContent && draggedNumber) {
    e.target.textContent = draggedNumber;
    draggedNumber = null;
    checkWin();
  }
}

function checkWin() {
  const blanks = document.querySelectorAll(".blank");
  let correct = true;

  blanks.forEach(blank => {
    if (blank.textContent != blank.dataset.answer) {
      correct = false;
    }
  });

  if (correct) {
    document.getElementById("message").textContent = "✅ You Win!";
    document.getElementById("nextBtn").style.display = "inline-block";
  }
}

function nextLevel() {
  currentLevel++;
  loadLevel(currentLevel);
  }
