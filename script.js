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
    numbersDiv.appendChild(div);

    // ✅ Click/tap to place number
    div.addEventListener("click", () => {
      const emptySlot = document.querySelector(".slot:not(:has(span)):empty");
      if (emptySlot && !div.used) {
        emptySlot.textContent = num;
        emptySlot.dataset.filled = num;
        div.style.visibility = "hidden";
        div.used = true;
        checkWin();
      }
    });
  });

  const slots = document.querySelectorAll(".slot");
  slots.forEach(slot => {
    // ✅ Tap a slot to clear it
    slot.addEventListener("click", () => {
      if (slot.textContent) {
        const num = slot.dataset.filled;
        slot.textContent = "";
        slot.dataset.filled = "";
        const tile = [...document.querySelectorAll(".number")].find(n => n.textContent === num && n.used);
        if (tile) {
          tile.style.visibility = "visible";
          tile.used = false;
        }
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
