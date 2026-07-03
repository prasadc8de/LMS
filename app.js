const demoLesson = {
  videoId: "M7lc1UVf-VE",
  intervalSeconds: 45,
  classroom: {
    courseId: "779920814",
    courseWorkId: "motion-lab-01",
    alternateLink: "https://classroom.google.com/",
    requiredSubmissionState: "TURNED_IN"
  },
  checkpoints: [
    {
      id: "gate-45",
      time: 45,
      type: "quiz",
      title: "Velocity Check",
      prompt: "A learner walks 20 meters in 10 seconds. What is the average speed?",
      options: ["0.5 m/s", "2 m/s", "10 m/s", "20 m/s"],
      answer: "2 m/s"
    },
    {
      id: "gate-90",
      time: 90,
      type: "classroom",
      title: "Motion Lab Upload",
      prompt: "Upload your worksheet to the mapped Google Classroom assignment."
    },
    {
      id: "gate-135",
      time: 135,
      type: "quiz",
      title: "Direction Check",
      prompt: "Which quantity includes both size and direction?",
      options: ["Distance", "Speed", "Vector", "Time"],
      answer: "Vector"
    }
  ]
};

const savedConfig = readJSON("lessonConfig", null);
if (savedConfig) {
  demoLesson.videoId = savedConfig.videoId || demoLesson.videoId;
  demoLesson.intervalSeconds = savedConfig.intervalSeconds || demoLesson.intervalSeconds;
  demoLesson.classroom.courseId = savedConfig.courseId || demoLesson.classroom.courseId;
  demoLesson.classroom.courseWorkId = savedConfig.courseWorkId || demoLesson.classroom.courseWorkId;
  rebuildCheckpoints();
}

const state = {
  player: null,
  poller: null,
  activeGate: null,
  completed: new Set(readJSON("completedGates", [])),
  attempts: Number(localStorage.getItem("attempts") || 0),
  correct: Number(localStorage.getItem("correct") || 0),
  submissions: Number(localStorage.getItem("submissions") || 0),
  lastTime: Number(localStorage.getItem("lastWatchTime") || 0)
};

const els = {
  checkpointList: document.querySelector("#checkpointList"),
  intervalLabel: document.querySelector("#intervalLabel"),
  progressLabel: document.querySelector("#progressLabel"),
  progressMeter: document.querySelector("#progressMeter"),
  completionBadge: document.querySelector("#completionBadge"),
  watchPosition: document.querySelector("#watchPosition"),
  scoreLabel: document.querySelector("#scoreLabel"),
  attemptsLabel: document.querySelector("#attemptsLabel"),
  submissionsLabel: document.querySelector("#submissionsLabel"),
  nextGateLabel: document.querySelector("#nextGateLabel"),
  classroomStatusLabel: document.querySelector("#classroomStatusLabel"),
  gateModal: document.querySelector("#gateModal"),
  modalType: document.querySelector("#modalType"),
  modalTitle: document.querySelector("#modalTitle"),
  modalContent: document.querySelector("#modalContent"),
  modalActions: document.querySelector("#modalActions"),
  adminPanel: document.querySelector("#adminPanel"),
  playerFallback: document.querySelector("#playerFallback"),
  videoIdInput: document.querySelector("#videoIdInput"),
  intervalInput: document.querySelector("#intervalInput"),
  courseIdInput: document.querySelector("#courseIdInput"),
  courseworkIdInput: document.querySelector("#courseworkIdInput"),
  courseIdLabel: document.querySelector("#courseIdLabel"),
  courseworkIdLabel: document.querySelector("#courseworkIdLabel"),
  toast: document.querySelector("#toast")
};

const youtubeApiTimer = window.setTimeout(() => {
  if (!state.player) {
    showToast("YouTube player is taking longer than expected. Check network access or the video ID.");
  }
}, 9000);

window.onYouTubeIframeAPIReady = () => {
  state.player = new YT.Player("player", {
    videoId: demoLesson.videoId,
    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      origin: window.location.origin
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  window.clearTimeout(youtubeApiTimer);
  els.playerFallback.classList.add("hidden");
  if (state.lastTime > 0) {
    event.target.seekTo(state.lastTime, true);
  }
  render();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    startPolling();
  } else {
    stopPolling();
  }
}

function startPolling() {
  stopPolling();
  state.poller = window.setInterval(tickPlayback, 700);
}

function stopPolling() {
  if (state.poller) {
    window.clearInterval(state.poller);
    state.poller = null;
  }
}

function tickPlayback() {
  if (!state.player || typeof state.player.getCurrentTime !== "function") return;

  const currentTime = Math.floor(state.player.getCurrentTime());
  state.lastTime = currentTime;
  localStorage.setItem("lastWatchTime", String(currentTime));

  const skippedGate = demoLesson.checkpoints.find((gate) => {
    return gate.time < currentTime && !state.completed.has(gate.id);
  });

  if (skippedGate) {
    state.player.seekTo(Math.max(skippedGate.time - 1, 0), true);
    openGate(skippedGate);
    return;
  }

  const reachedGate = demoLesson.checkpoints.find((gate) => {
    return currentTime >= gate.time && !state.completed.has(gate.id);
  });

  if (reachedGate) {
    openGate(reachedGate);
  }

  render();
}

function openGate(gate) {
  if (els.gateModal.open) return;
  state.activeGate = gate.id;
  stopPolling();
  state.player.pauseVideo();
  render();

  if (gate.type === "quiz") {
    renderQuizGate(gate);
  } else {
    renderClassroomGate(gate);
  }

  els.gateModal.showModal();
}

function renderQuizGate(gate) {
  els.modalType.textContent = "Quiz checkpoint";
  els.modalTitle.textContent = gate.title;
  els.modalContent.innerHTML = `
    <p>${escapeHTML(gate.prompt)}</p>
    <div class="choice-list">
      ${gate.options.map((option) => `
        <label>
          <input type="radio" name="quizAnswer" value="${escapeHTML(option)}">
          <span>${escapeHTML(option)}</span>
        </label>
      `).join("")}
    </div>
  `;
  els.modalActions.innerHTML = `
    <button class="secondary-button" id="submitQuizBtn" type="button">Submit answer</button>
  `;

  document.querySelector("#submitQuizBtn").addEventListener("click", () => {
    const selected = document.querySelector("input[name='quizAnswer']:checked");
    if (!selected) {
      showToast("Choose an answer to continue.");
      return;
    }

    state.attempts += 1;
    localStorage.setItem("attempts", String(state.attempts));

    if (selected.value !== gate.answer) {
      showToast("Not quite. Try again before the lesson resumes.");
      render();
      return;
    }

    state.correct += 1;
    localStorage.setItem("correct", String(state.correct));
    completeGate(gate);
    showToast("Correct. Resuming the video.");
  });
}

function renderClassroomGate(gate) {
  els.modalType.textContent = "Google Classroom checkpoint";
  els.modalTitle.textContent = gate.title;
  els.modalContent.innerHTML = `
    <p>${escapeHTML(gate.prompt)}</p>
    <dl class="mapping-list">
      <div><dt>Course ID</dt><dd>${escapeHTML(demoLesson.classroom.courseId)}</dd></div>
      <div><dt>Coursework ID</dt><dd>${escapeHTML(demoLesson.classroom.courseWorkId)}</dd></div>
      <div><dt>Required status</dt><dd>${escapeHTML(demoLesson.classroom.requiredSubmissionState)}</dd></div>
    </dl>
    <p class="label">MVP integration: replace this status check with Classroom studentSubmissions.list/get on your backend.</p>
  `;
  els.modalActions.innerHTML = `
    <button class="ghost-button" id="openClassroomModalBtn" type="button">Open Classroom</button>
    <button class="secondary-button" id="checkSubmissionBtn" type="button">Check submission</button>
  `;

  document.querySelector("#openClassroomModalBtn").addEventListener("click", openClassroom);
  document.querySelector("#checkSubmissionBtn").addEventListener("click", () => {
    state.submissions += 1;
    localStorage.setItem("submissions", String(state.submissions));
    completeGate(gate);
    showToast("Classroom submission found. Resuming the video.");
  });
}

function completeGate(gate) {
  state.completed.add(gate.id);
  state.activeGate = null;
  localStorage.setItem("completedGates", JSON.stringify([...state.completed]));
  els.gateModal.close();
  render();
  state.player.playVideo();
}

function render() {
  renderCheckpoints();
  renderStats();
  renderMapping();
}

function renderCheckpoints() {
  els.intervalLabel.textContent = `Every ${demoLesson.intervalSeconds} seconds`;
  els.checkpointList.innerHTML = demoLesson.checkpoints.map((gate) => {
    const completed = state.completed.has(gate.id);
    const active = state.activeGate === gate.id;
    const status = completed ? "Done" : active ? "Paused" : gate.type === "quiz" ? "Quiz" : "Classroom";
    return `
      <article class="checkpoint ${completed ? "completed" : ""} ${active ? "active" : ""}">
        <div class="checkpoint-icon">${completed ? "OK" : formatMinutes(gate.time)}</div>
        <div>
          <strong>${escapeHTML(gate.title)}</strong>
          <small>${gate.type === "quiz" ? "Answer required to resume" : "Classroom submission required"}</small>
        </div>
        <span class="pill">${status}</span>
      </article>
    `;
  }).join("");
}

function renderStats() {
  const total = demoLesson.checkpoints.length;
  const completeCount = getCompletedCount();
  const percent = Math.round((completeCount / total) * 100);
  const score = state.attempts ? Math.round((state.correct / state.attempts) * 100) : 0;
  const nextGate = demoLesson.checkpoints.find((gate) => !state.completed.has(gate.id));

  els.progressLabel.textContent = `${completeCount} of ${total} gates`;
  els.progressMeter.style.width = `${percent}%`;
  els.completionBadge.textContent = percent === 100 ? "Completed" : "In progress";
  els.watchPosition.textContent = formatTime(state.lastTime);
  els.scoreLabel.textContent = `${score}%`;
  els.attemptsLabel.textContent = String(state.attempts);
  els.submissionsLabel.textContent = String(state.submissions);
  els.nextGateLabel.textContent = nextGate ? `${nextGate.type === "quiz" ? "Quiz" : "Classroom"} at ${formatTime(nextGate.time)}` : "All gates done";
  els.classroomStatusLabel.textContent = "Connected";
}

function renderMapping() {
  els.courseIdLabel.textContent = demoLesson.classroom.courseId;
  els.courseworkIdLabel.textContent = demoLesson.classroom.courseWorkId;
  els.videoIdInput.value = demoLesson.videoId;
  els.intervalInput.value = demoLesson.intervalSeconds;
  els.courseIdInput.value = demoLesson.classroom.courseId;
  els.courseworkIdInput.value = demoLesson.classroom.courseWorkId;
}

function saveConfig() {
  const nextVideoId = els.videoIdInput.value.trim();
  const nextInterval = Number(els.intervalInput.value);
  const nextCourseId = els.courseIdInput.value.trim();
  const nextCourseWorkId = els.courseworkIdInput.value.trim();

  if (!/^[a-zA-Z0-9_-]{6,}$/.test(nextVideoId)) {
    showToast("Enter a valid YouTube video ID.");
    return;
  }

  if (!Number.isFinite(nextInterval) || nextInterval < 15 || nextInterval > 900) {
    showToast("Use an interval between 15 and 900 seconds.");
    return;
  }

  demoLesson.videoId = nextVideoId;
  demoLesson.intervalSeconds = nextInterval;
  demoLesson.classroom.courseId = nextCourseId || demoLesson.classroom.courseId;
  demoLesson.classroom.courseWorkId = nextCourseWorkId || demoLesson.classroom.courseWorkId;

  localStorage.setItem("lessonConfig", JSON.stringify({
    videoId: demoLesson.videoId,
    intervalSeconds: demoLesson.intervalSeconds,
    courseId: demoLesson.classroom.courseId,
    courseWorkId: demoLesson.classroom.courseWorkId
  }));

  rebuildCheckpoints();
  state.completed.clear();
  state.activeGate = null;
  state.lastTime = 0;
  state.attempts = 0;
  state.correct = 0;
  state.submissions = 0;
  localStorage.setItem("completedGates", "[]");
  localStorage.setItem("lastWatchTime", "0");
  localStorage.setItem("attempts", "0");
  localStorage.setItem("correct", "0");
  localStorage.setItem("submissions", "0");
  if (state.player) {
    state.player.loadVideoById(demoLesson.videoId);
  }
  els.adminPanel.close();
  render();
  showToast("Lesson setup saved.");
}

function rebuildCheckpoints() {
  demoLesson.checkpoints = demoLesson.checkpoints.map((gate, index) => {
    const time = demoLesson.intervalSeconds * (index + 1);
    return {
      ...gate,
      time,
      id: `gate-${time}`
    };
  });
}

function getCompletedCount() {
  return demoLesson.checkpoints.filter((gate) => state.completed.has(gate.id)).length;
}

function openClassroom() {
  window.open(demoLesson.classroom.alternateLink, "_blank", "noopener,noreferrer");
}

function syncClassroom() {
  showToast("Classroom sync complete. In production this calls courses.courseWork.studentSubmissions.");
}

function switchAccount() {
  const nextEmail = window.prompt("Enter learner Gmail", document.querySelector("#studentEmail").textContent);
  if (!nextEmail) return;
  document.querySelector("#studentEmail").textContent = nextEmail;
  showToast("Gmail updated for this demo session.");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatMinutes(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

document.querySelector("#adminToggleBtn").addEventListener("click", () => els.adminPanel.showModal());
document.querySelector("#saveConfigBtn").addEventListener("click", saveConfig);
document.querySelector("#syncClassroomBtn").addEventListener("click", syncClassroom);
document.querySelector("#openClassroomBtn").addEventListener("click", openClassroom);
document.querySelector("#switchAccountBtn").addEventListener("click", switchAccount);
els.gateModal.addEventListener("cancel", (event) => {
  if (state.activeGate) {
    event.preventDefault();
    showToast("Complete this checkpoint to continue.");
  }
});

render();
