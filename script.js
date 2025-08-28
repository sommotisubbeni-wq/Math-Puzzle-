let currentLevel = 1;
let levelsData = [];

async function loadLevels() {
  const response = await fetch("levels.json");
  const data = await response.json();
  levelsData = data.levels;
  loadLevel(currentLevel);
}

function loadLevel(levelId) {
  const puzzleDiv = document.getElementById("puzzle");
  const numbersDiv = document.getElementById("numbers");
  const title = document.getElementById("levelTitle");
  const message = document.getElementById("message");
  const nextBtn = document.getElementById("nextBtn");

  puzzleDiv.innerHTML = "";
  numbersDiv.innerHTML = "";
  message.textContent = "";
  nextBtn.style.display = "none";

  const level = levelsData.find(l => l.id === levelId);
  if (!level) {
    title.textContent = "🎉 Game Completed!";
    return;
  }

  title.textContent = `Level ${level.id} (${level.difficulty})`;

  // Build equations
  level.equations.forEach(eq => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = eq.text.replace("{slot}", `<span class="slot" data-answer="${eq.answer}"></span>`);
    puzzleDiv.appendChild(row);
  });

  // Build number tiles
  level.numbers.forEach(num => {
    const div = document.createElement("div");
    div.className = "number";
    div.textContent = num;
    div.draggable = true;
    numbersDiv.appendChild(div);

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text", e.target.textContent);
    });
  });

  const slots = document.querySelectorAll(".slot");
  slots.forEach(slot => {
    slot.addEventListener("dragover", e => e.preventDefault());
    slot.addEventListener("drop", e => {
      e.preventDefault();
      if (!slot.textContent) {
        const num = e.dataTransfer.getData("text");
        slot.textContent = num;
        checkWin();
      }
    });
  });

  function checkWin() {
    let correct = true;
    slots.forEach(slot => {
      if (slot.textContent !== slot.dataset.answer) correct = false;
    });
    if (correct) {
      message.textContent = "✅ Correct! You Win!";
      message.style.color = "green";
      nextBtn.style.display = "inline-block";
    }
  }

  nextBtn.onclick = () => {
    currentLevel++;
    loadLevel(currentLevel);
  };
}

loadLevels();
