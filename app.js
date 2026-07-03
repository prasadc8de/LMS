const siteAuthConfig = {
  googleClientId: "1310085727-91rrgsf6ck7d03r2fqu7e2ro4orbc4kf.apps.googleusercontent.com",
  allowedEmails: [
    "aishurao2021@gmail.com",
    "prasadboyane@gmail.com"
  ]
};

const defaultLessons = [
  createLesson("lesson-1", "Lesson 1", "Private video + checkpoints", "SxZ4LRkxPyk"),
  createLesson("lesson-2", "Lesson 2", "Private video + checkpoints", "3HAUfCQEJ8g"),
  createLesson("lesson-3", "Lesson 3", "Private video + checkpoints", "UKq_6n96Z-0")
];

const savedAuthConfig = readJSON("authConfig", {});
const authConfig = {
  googleClientId: siteAuthConfig.googleClientId || savedAuthConfig.googleClientId || "",
  allowedEmails: siteAuthConfig.allowedEmails.length > 0
    ? siteAuthConfig.allowedEmails
    : savedAuthConfig.allowedEmails || []
};

const state = {
  player: null,
  poller: null,
  activeGate: null,
  currentLessonIndex: Number(localStorage.getItem("currentLessonIndex") || 0),
  user: readJSON("signedInUser", null),
  lessonState: readJSON("lessonState", {}),
  lessons: readJSON("lessons", defaultLessons)
};

const els = {
  authGate: document.querySelector("#authGate"),
  authStatus: document.querySelector("#authStatus"),
  googleButton: document.querySelector("#googleButton"),
  adminGoogleClientIdInput: document.querySelector("#adminGoogleClientIdInput"),
  adminAllowedEmailsInput: document.querySelector("#adminAllowedEmailsInput"),
  lessonList: document.querySelector("#lessonList"),
  studentEmail: document.querySelector("#studentEmail"),
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

normalizeLessonIndex();
hydrateAuthConfigInputs();
renderAuthState();
render();

const youtubeApiTimer = window.setTimeout(() => {
  if (!state.player) {
    showToast("YouTube player is taking longer than expected. Check network access or the video ID.");
  }
}, 9000);

window.onYouTubeIframeAPIReady = () => {
  const lesson = getCurrentLesson();
  state.player = new YT.Player("player", {
    videoId: lesson.videoId,
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

window.addEventListener("load", () => {
  initializeGoogleSignIn();
});

function createLesson(id, title, subtitle, videoId) {
  return {
    id,
    title,
    subtitle,
    videoId,
    intervalSeconds: 45,
    classroom: {
      courseId: "779920814",
      courseWorkId: `${id}-assignment`,
      alternateLink: "https://classroom.google.com/",
      requiredSubmissionState: "TURNED_IN"
    },
    checkpoints: [
      {
        id: `${id}-gate-45`,
        time: 45,
        type: "quiz",
        title: "Concept Check",
        prompt: "Choose the best answer before continuing the lesson.",
        options: ["I understand this section", "I need to skip ahead", "I have not watched it", "This is unrelated"],
        answer: "I understand this section"
      },
      {
        id: `${id}-gate-90`,
        time: 90,
        type: "classroom",
        title: "Classroom Upload",
        prompt: "Open the mapped Google Classroom assignment and submit the requested material."
      },
      {
        id: `${id}-gate-135`,
        time: 135,
        type: "quiz",
        title: "Readiness Check",
        prompt: "What should you do after completing this checkpoint?",
        options: ["Resume the lesson", "Close the browser", "Use another Gmail", "Ignore the assignment"],
        answer: "Resume the lesson"
      }
    ]
  };
}

function initializeGoogleSignIn() {
  if (!authConfig.googleClientId) {
    els.authStatus.textContent = "Google sign-in is not configured yet.";
    return;
  }

  if (!window.google?.accounts?.id) {
    window.setTimeout(initializeGoogleSignIn, 400);
    return;
  }

  window.google.accounts.id.initialize({
    client_id: authConfig.googleClientId,
    callback: handleCredentialResponse
  });

  els.googleButton.innerHTML = "";
  window.google.accounts.id.renderButton(els.googleButton, {
    theme: "outline",
    size: "large",
    type: "standard",
    shape: "rectangular",
    text: "sign_in_with"
  });
  els.authStatus.textContent = "Sign in with an allowed Gmail account.";
}

function handleCredentialResponse(response) {
  const profile = decodeJwt(response.credential);
  if (!profile?.email || profile.email_verified === false) {
    showAuthError("Google did not return a verified Gmail account.");
    return;
  }

  const email = profile.email.toLowerCase();
  const allowed = authConfig.allowedEmails.map((item) => item.toLowerCase());
  if (allowed.length > 0 && !allowed.includes(email)) {
    showAuthError(`${profile.email} is not enrolled in this LMS.`);
    return;
  }

  state.user = {
    email: profile.email,
    name: profile.name || profile.email,
    picture: profile.picture || ""
  };
  localStorage.setItem("signedInUser", JSON.stringify(state.user));
  renderAuthState();
  showToast(`Signed in as ${state.user.email}`);
}

function renderAuthState() {
  if (state.user?.email) {
    els.authGate.classList.add("hidden");
    els.studentEmail.textContent = state.user.email;
    return;
  }

  els.authGate.classList.remove("hidden");
  els.studentEmail.textContent = "Not signed in";
}

function showAuthError(message) {
  els.authStatus.textContent = message;
  showToast(message);
}

function onPlayerReady(event) {
  window.clearTimeout(youtubeApiTimer);
  els.playerFallback.classList.add("hidden");
  const progress = getCurrentProgress();
  if (progress.lastTime > 0) {
    event.target.seekTo(progress.lastTime, true);
  }
  render();
}

function onPlayerStateChange(event) {
  if (!state.user?.email) {
    state.player.pauseVideo();
    renderAuthState();
    return;
  }

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
  if (!state.user?.email) {
    state.player.pauseVideo();
    return;
  }

  if (!state.player || typeof state.player.getCurrentTime !== "function") return;

  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  const currentTime = Math.floor(state.player.getCurrentTime());
  progress.lastTime = currentTime;
  saveLessonState();

  const skippedGate = lesson.checkpoints.find((gate) => {
    return gate.time < currentTime && !progress.completed.includes(gate.id);
  });

  if (skippedGate) {
    state.player.seekTo(Math.max(skippedGate.time - 1, 0), true);
    openGate(skippedGate);
    return;
  }

  const reachedGate = lesson.checkpoints.find((gate) => {
    return currentTime >= gate.time && !progress.completed.includes(gate.id);
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

    const progress = getCurrentProgress();
    progress.attempts += 1;

    if (selected.value !== gate.answer) {
      saveLessonState();
      showToast("Not quite. Try again before the lesson resumes.");
      render();
      return;
    }

    progress.correct += 1;
    completeGate(gate);
    showToast("Correct. Resuming the video.");
  });
}

function renderClassroomGate(gate) {
  const lesson = getCurrentLesson();
  els.modalType.textContent = "Google Classroom checkpoint";
  els.modalTitle.textContent = gate.title;
  els.modalContent.innerHTML = `
    <p>${escapeHTML(gate.prompt)}</p>
    <dl class="mapping-list">
      <div><dt>Course ID</dt><dd>${escapeHTML(lesson.classroom.courseId)}</dd></div>
      <div><dt>Coursework ID</dt><dd>${escapeHTML(lesson.classroom.courseWorkId)}</dd></div>
      <div><dt>Required status</dt><dd>${escapeHTML(lesson.classroom.requiredSubmissionState)}</dd></div>
    </dl>
    <p class="label">MVP integration: replace this status check with Classroom studentSubmissions.list/get on your backend.</p>
  `;
  els.modalActions.innerHTML = `
    <button class="ghost-button" id="openClassroomModalBtn" type="button">Open Classroom</button>
    <button class="secondary-button" id="checkSubmissionBtn" type="button">Check submission</button>
  `;

  document.querySelector("#openClassroomModalBtn").addEventListener("click", openClassroom);
  document.querySelector("#checkSubmissionBtn").addEventListener("click", () => {
    const progress = getCurrentProgress();
    progress.submissions += 1;
    completeGate(gate);
    showToast("Classroom submission found. Resuming the video.");
  });
}

function completeGate(gate) {
  const progress = getCurrentProgress();
  if (!progress.completed.includes(gate.id)) {
    progress.completed.push(gate.id);
  }
  state.activeGate = null;
  saveLessonState();
  els.gateModal.close();
  render();
  state.player.playVideo();
}

function render() {
  renderLessonList();
  renderCheckpoints();
  renderStats();
  renderMapping();
}

function renderLessonList() {
  els.lessonList.innerHTML = state.lessons.map((lesson, index) => `
    <button class="lesson-item ${index === state.currentLessonIndex ? "active" : ""}" type="button" data-lesson-index="${index}">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHTML(lesson.title)}</strong>
        <small>${escapeHTML(lesson.subtitle)}</small>
      </div>
    </button>
  `).join("");

  els.lessonList.querySelectorAll(".lesson-item").forEach((button) => {
    button.addEventListener("click", () => switchLesson(Number(button.dataset.lessonIndex)));
  });
}

function renderCheckpoints() {
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  els.intervalLabel.textContent = `Every ${lesson.intervalSeconds} seconds`;
  els.checkpointList.innerHTML = lesson.checkpoints.map((gate) => {
    const completed = progress.completed.includes(gate.id);
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
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  const total = lesson.checkpoints.length;
  const completeCount = progress.completed.length;
  const percent = Math.round((completeCount / total) * 100);
  const score = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const nextGate = lesson.checkpoints.find((gate) => !progress.completed.includes(gate.id));

  document.querySelector("h1").textContent = lesson.title;
  document.querySelector(".topbar .eyebrow").textContent = "Private Video Series";
  els.progressLabel.textContent = `${completeCount} of ${total} gates`;
  els.progressMeter.style.width = `${percent}%`;
  els.completionBadge.textContent = percent === 100 ? "Completed" : "In progress";
  els.watchPosition.textContent = formatTime(progress.lastTime);
  els.scoreLabel.textContent = `${score}%`;
  els.attemptsLabel.textContent = String(progress.attempts);
  els.submissionsLabel.textContent = String(progress.submissions);
  els.nextGateLabel.textContent = nextGate ? `${nextGate.type === "quiz" ? "Quiz" : "Classroom"} at ${formatTime(nextGate.time)}` : "All gates done";
  els.classroomStatusLabel.textContent = "Mapped";
}

function renderMapping() {
  const lesson = getCurrentLesson();
  els.courseIdLabel.textContent = lesson.classroom.courseId;
  els.courseworkIdLabel.textContent = lesson.classroom.courseWorkId;
  els.videoIdInput.value = lesson.videoId;
  els.intervalInput.value = lesson.intervalSeconds;
  els.courseIdInput.value = lesson.classroom.courseId;
  els.courseworkIdInput.value = lesson.classroom.courseWorkId;
  els.adminGoogleClientIdInput.value = authConfig.googleClientId;
  els.adminAllowedEmailsInput.value = authConfig.allowedEmails.join("\n");
}

function saveConfig() {
  const lesson = getCurrentLesson();
  const nextVideoId = els.videoIdInput.value.trim();
  const nextInterval = Number(els.intervalInput.value);
  const nextCourseId = els.courseIdInput.value.trim();
  const nextCourseWorkId = els.courseworkIdInput.value.trim();
  const nextGoogleClientId = els.adminGoogleClientIdInput.value.trim();
  const nextAllowedEmails = parseEmailList(els.adminAllowedEmailsInput.value);

  if (!/^[a-zA-Z0-9_-]{6,}$/.test(nextVideoId)) {
    showToast("Enter a valid YouTube video ID.");
    return;
  }

  if (!Number.isFinite(nextInterval) || nextInterval < 15 || nextInterval > 900) {
    showToast("Use an interval between 15 and 900 seconds.");
    return;
  }

  lesson.videoId = nextVideoId;
  lesson.intervalSeconds = nextInterval;
  lesson.classroom.courseId = nextCourseId || lesson.classroom.courseId;
  lesson.classroom.courseWorkId = nextCourseWorkId || lesson.classroom.courseWorkId;
  rebuildCheckpoints(lesson);
  resetCurrentLessonProgress();
  saveLessons();

  authConfig.googleClientId = nextGoogleClientId;
  authConfig.allowedEmails = nextAllowedEmails;
  localStorage.setItem("authConfig", JSON.stringify(authConfig));
  hydrateAuthConfigInputs();

  if (state.player) {
    state.player.loadVideoById(lesson.videoId);
  }
  els.adminPanel.close();
  renderAuthState();
  initializeGoogleSignIn();
  render();
  showToast("Lesson setup saved.");
}

function switchLesson(index) {
  if (index === state.currentLessonIndex) return;
  state.currentLessonIndex = index;
  localStorage.setItem("currentLessonIndex", String(index));
  state.activeGate = null;
  if (els.gateModal.open) {
    els.gateModal.close();
  }
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  if (state.player) {
    state.player.loadVideoById(lesson.videoId);
    if (progress.lastTime > 0) {
      state.player.seekTo(progress.lastTime, true);
    }
  }
  render();
}

function rebuildCheckpoints(lesson) {
  lesson.checkpoints = lesson.checkpoints.map((gate, index) => {
    const time = lesson.intervalSeconds * (index + 1);
    return {
      ...gate,
      time,
      id: `${lesson.id}-gate-${time}`
    };
  });
}

function resetCurrentLessonProgress() {
  state.lessonState[getCurrentLesson().id] = createEmptyProgress();
  saveLessonState();
}

function getCurrentLesson() {
  return state.lessons[state.currentLessonIndex];
}

function getCurrentProgress() {
  const lesson = getCurrentLesson();
  if (!state.lessonState[lesson.id]) {
    state.lessonState[lesson.id] = createEmptyProgress();
  }
  return state.lessonState[lesson.id];
}

function createEmptyProgress() {
  return {
    completed: [],
    attempts: 0,
    correct: 0,
    submissions: 0,
    lastTime: 0
  };
}

function saveLessonState() {
  localStorage.setItem("lessonState", JSON.stringify(state.lessonState));
}

function saveLessons() {
  localStorage.setItem("lessons", JSON.stringify(state.lessons));
}

function openClassroom() {
  window.open(getCurrentLesson().classroom.alternateLink, "_blank", "noopener,noreferrer");
}

function syncClassroom() {
  showToast("Classroom sync needs a backend for real studentSubmissions API checks.");
}

function signOut() {
  state.user = null;
  localStorage.removeItem("signedInUser");
  if (state.player) {
    state.player.pauseVideo();
  }
  if (window.google?.accounts?.id) {
    window.google.accounts.id.disableAutoSelect();
  }
  renderAuthState();
  showToast("Signed out.");
}

function hydrateAuthConfigInputs() {
  els.adminGoogleClientIdInput.value = authConfig.googleClientId;
  els.adminAllowedEmailsInput.value = authConfig.allowedEmails.join("\n");
}

function parseEmailList(value) {
  return value
    .split(/[\n,; ]+/)
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item));
}

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeURIComponent(atob(payload).split("").map((char) => {
      return `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`;
    }).join(""));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function normalizeLessonIndex() {
  if (!Number.isInteger(state.currentLessonIndex) || !state.lessons[state.currentLessonIndex]) {
    state.currentLessonIndex = 0;
  }
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
document.querySelector("#switchAccountBtn").addEventListener("click", signOut);
els.gateModal.addEventListener("cancel", (event) => {
  if (state.activeGate) {
    event.preventDefault();
    showToast("Complete this checkpoint to continue.");
  }
});
