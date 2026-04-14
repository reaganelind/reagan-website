const dot = document.getElementById("dot");
const overlay = document.getElementById("overlayText");
const progress = document.getElementById("progress");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let repetitions = 0;
const maxReps = 5;

let cycleTimer;
let breathTimer;

/* ---------- AMBIENT AUDIO ---------- */
const ambient = new Audio("/reagan-website/ambient.mp3"); // correct for GitHub Pages
ambient.loop = true;
ambient.volume = 0.25;

/* ---------- EVENT LISTENERS ---------- */
startBtn.addEventListener("click", async () => {
  try {
    await document.documentElement.requestFullscreen();
  } catch (e) {
    console.log("Fullscreen not supported or blocked");
  }

  // ✅ FIX: play audio directly on user interaction
  ambient.play().catch(err => console.log("Audio blocked:", err));

  startBtn.style.display = "none";
  countdownStart();
});

stopBtn.addEventListener("click", stopExerciseEarly);

/* ---------- COUNTDOWN ---------- */
function countdownStart() {
  let count = 3;
  overlay.textContent = count;

  const interval = setInterval(() => {
    count--;

    if (count > 0) {
      overlay.textContent = count;
    } else if (count === 0) {
      overlay.textContent = "Begin";
    } else {
      clearInterval(interval);
      startAnimation(); // ❌ removed ambient.play() from here
    }
  }, 1000);
}

/* ---------- START SESSION ---------- */
function startAnimation() {
  stopExistingIntervals();

  repetitions = 0;
  updateProgress();
  resetAnimation();

  dot.classList.add("animate");

  startCycleCounter();
  startBreathingGuide();
}

/* ---------- RESET DOT ---------- */
function resetAnimation() {
  dot.classList.remove("animate");
  void dot.offsetWidth;
}

/* ---------- CYCLE COUNTER ---------- */
function startCycleCounter() {
  cycleTimer = setInterval(() => {
    repetitions++;
    updateProgress();

    if (repetitions >= maxReps) {
      stopExercise();
    }
  }, 16000);
}

/* ---------- BREATHING GUIDE ---------- */
function startBreathingGuide() {
  const steps = ["Inhale", "Hold", "Exhale", "Hold"];
  let i = 0;

  function render(step) {
    overlay.textContent = step;

    if (step === "Exhale") {
      overlay.classList.add("exhale");
    } else {
      overlay.classList.remove("exhale");
    }
  }

  render(steps[i]);

  breathTimer = setInterval(() => {
    i = (i + 1) % steps.length;
    render(steps[i]);
  }, 4000);
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
  progress.textContent = `${repetitions} / ${maxReps} cycles`;
}

/* ---------- STOP ---------- */
function stopExercise() {
  stopExistingIntervals();
  dot.classList.remove("animate");

  ambient.pause();
  ambient.currentTime = 0;

  askHeartRate();
}

function stopExerciseEarly() {
  stopExistingIntervals();
  dot.classList.remove("animate");

  ambient.pause();
  ambient.currentTime = 0;

  overlay.textContent = "Stopped";

  askHeartRate();
}

/* ---------- CLEANUP ---------- */
function stopExistingIntervals() {
  if (cycleTimer) clearInterval(cycleTimer);
  if (breathTimer) clearInterval(breathTimer);
}

/* ---------- HEART RATE LOGIC ---------- */
function askHeartRate() {
  alert(
    "Congratulations on completing the breathing exercise!\n\n" +
    "The box breathing you just completed helps calm your body by slowing your breathing and activating the vagus nerve. " +
    "This lowers heart rate, reduces stress signals, and shifts you out of the Sympathetic Nervous System into a more relaxed state."
  );

  let hr = prompt("Enter your current heart rate (BPM):");

  if (hr === null) return;

  hr = parseInt(hr);

  if (isNaN(hr)) {
    alert("Please enter a valid number.");
    return askHeartRate();
  }

  if (hr > 80) {
    const repeat = confirm("Your heartrate is still elevated, indicating an acute stress response. Press OK to repeat exercise. Press Cancel for alternative stress reduction.");

    if (repeat) {
      startAnimation();
    } else {
      alert("Your heartrate is still elevated. A short walk or physical activity can help reduce this response.");
      window.location.href = "journal_intro_2.html";
    }
  } else {
    window.location.href = "journal_intro.html";
  }
}
