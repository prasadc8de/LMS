const siteAuthConfig = {
  googleClientId: "1310085727-91rrgsf6ck7d03r2fqu7e2ro4orbc4kf.apps.googleusercontent.com",
  allowedEmails: [
    "aishurao2021@gmail.com",
    "prasadboyane@gmail.com"
  ]
};

const classroomAssignmentUrl = "https://classroom.google.com/w/ODMxNzMzNTA1MjY4/tc/ODIxMDA2NTA2OTY2";
const lessonCatalogVersion = "2026-07-15-classroom-python-v4";

const taskNotes = [
  "Make videos on every question / concept and upload on YouTube.",
  "Solve questions in video / assignments and submit in Classroom.",
  "Write queries in the QnA Sheet.",
  "Complete the daily mock interview session."
];

const defaultLessons = [
  buildLesson({
    id: "python-lecture-1",
    title: "Watch Python Lecture 1",
    videoId: "SxZ4LRkxPyk",
    posted: "Posted 8 Dec 2025",
    due: "Due 13 Dec 2025",
    focus: "Python Lecture 1",
    quizA: "What should you create after solving each Lecture 1 question or concept?",
    answerA: "A short YouTube explanation video",
    quizB: "Where should your solved assignment work be submitted?",
    answerB: "Google Classroom"
  }),
  buildLesson({
    id: "python-lecture-2",
    title: "Watch Python Lecture 2",
    videoId: "gjdsIoA88JU",
    posted: "Posted 9 Dec 2025",
    due: "Due 13 Dec 2025",
    focus: "Python Lecture 2",
    quizA: "What is the best habit while following the Lecture 2 examples?",
    answerA: "Pause and solve the example yourself",
    quizB: "Where should questions from this lesson be captured?",
    answerB: "QnA Sheet"
  }),
  buildLesson({
    id: "python-lecture-3",
    title: "Watch Python Lecture 3",
    videoId: "UKq_6n96Z-0",
    posted: "Posted 10 Dec 2025",
    due: "Due 13 Dec 2025",
    focus: "Python Lecture 3",
    quizA: "What should you do before moving past a confusing Lecture 3 concept?",
    answerA: "Write the query and revisit the timestamp",
    quizB: "What confirms you practiced the video questions?",
    answerB: "A Classroom submission"
  }),
  buildLesson({
    id: "python-lecture-4",
    title: "Watch Python Lecture 4",
    videoId: "WDW9Dxi5lO4",
    posted: "Posted 11 Dec 2025",
    due: "Due 14 Dec 2025",
    focus: "Python Lecture 4",
    quizA: "What should your Lecture 4 notes capture first?",
    answerA: "The rule or pattern used in the example",
    quizB: "What should you complete along with the video assignment?",
    answerB: "Daily mock interview session"
  }),
  buildLesson({
    id: "python-lecture-5",
    title: "Watch Python Lecture 5",
    videoId: "1bgpbl9Yj88",
    posted: "Posted 15 Dec 2025",
    due: "Due 20 Dec 2025",
    focus: "Python Lecture 5",
    quizA: "How should you handle each new Lecture 5 concept?",
    answerA: "Explain it in your own words",
    quizB: "Which upload proves your explanation practice?",
    answerB: "YouTube concept video"
  }),
  buildLesson({
    id: "python-lecture-6",
    title: "Watch Python Lecture 6",
    videoId: "P9ywHK_IvUc",
    posted: "Posted 16 Dec 2025",
    due: "Due 20 Dec 2025",
    focus: "Python Lecture 6",
    quizA: "What is the expected action after solving a Lecture 6 problem?",
    answerA: "Record and upload the explanation",
    quizB: "Where should the final solved work be submitted?",
    answerB: "Google Classroom"
  }),
  buildLesson({
    id: "python-lecture-7",
    title: "Watch Python Lecture 7",
    videoId: "UHP2wyxdRuQ",
    posted: "Posted 17 Dec 2025",
    due: "Due 20 Dec 2025",
    focus: "Python Lecture 7",
    quizA: "What should you do if Lecture 7 raises a doubt?",
    answerA: "Add it to the QnA Sheet",
    quizB: "What classroom routine should be completed daily?",
    answerB: "Mock interview session"
  }),
  buildLesson({
    id: "python-lecture-8",
    title: "Watch Python Lecture 8",
    videoId: "3HAUfCQEJ8g",
    posted: "Posted 18 Dec 2025",
    due: "Due 20 Dec 2025",
    focus: "Python Lecture 8",
    quizA: "What should you focus on while watching Lecture 8?",
    answerA: "The steps in each worked example",
    quizB: "What is required before marking the lesson complete?",
    answerB: "Assignment submission in Classroom"
  }),
  buildLesson({
    id: "python-lecture-9",
    title: "Watch Python Lecture 9",
    videoId: "abFXQSo3Lx0",
    posted: "Posted 22 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Python Lecture 9",
    quizA: "What should you produce for every important Lecture 9 concept?",
    answerA: "A YouTube explanation video",
    quizB: "Where do unresolved doubts belong?",
    answerB: "QnA Sheet"
  }),
  buildLesson({
    id: "python-lecture-10-api",
    title: "Watch Python Lecture 10: API",
    videoId: "AqOsJQOxp1w",
    posted: "Posted 23 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Lecture 10 API section",
    extraNotes: ["API video: https://youtu.be/AqOsJQOxp1w"],
    assignmentTitle: "Watch Python Lecture 10",
    quizA: "What should you identify first in the API section?",
    answerA: "The request and response flow",
    quizB: "Where should API practice work be submitted?",
    answerB: "Google Classroom"
  }),
  buildLesson({
    id: "python-lecture-10-mysql",
    title: "Watch Python Lecture 10: MySQL Connectivity",
    videoId: "-Po8PQsgad8",
    posted: "Posted 23 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Lecture 10 MySQL Connectivity section",
    extraNotes: ["MySQL Connectivity video: https://youtu.be/-Po8PQsgad8"],
    assignmentTitle: "Watch Python Lecture 10",
    quizA: "What should you verify when practicing MySQL connectivity?",
    answerA: "The connection and query result",
    quizB: "Where should connectivity doubts be recorded?",
    answerB: "QnA Sheet"
  }),
  buildLesson({
    id: "python-lecture-10-selenium",
    title: "Watch Python Lecture 10: Selenium",
    videoId: "euEnBa-AKZ0",
    posted: "Posted 23 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Lecture 10 Selenium section",
    extraNotes: ["Selenium video: https://youtu.be/euEnBa-AKZ0"],
    assignmentTitle: "Watch Python Lecture 10",
    quizA: "What should you observe first in the Selenium section?",
    answerA: "The browser action being automated",
    quizB: "What evidence should you prepare after practice?",
    answerB: "A solved assignment or explanation video"
  }),
  buildLesson({
    id: "python-lecture-11",
    title: "Watch Python Lecture 11",
    videoId: "2MG9fgTI4Ww",
    posted: "Posted 24 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Python Lecture 11",
    quizA: "What should you do with every Lecture 11 question or concept?",
    answerA: "Make a video explanation",
    quizB: "What should happen after solving the assignment?",
    answerB: "Submit it in Classroom"
  }),
  buildLesson({
    id: "python-lecture-12",
    title: "Watch Python Lecture 12",
    videoId: "aJzmP56uFvI",
    posted: "Posted 25 Dec 2025",
    due: "Due 28 Dec 2025",
    focus: "Python Lecture 12",
    quizA: "How should you close out Lecture 12 practice?",
    answerA: "Submit solved work and questions",
    quizB: "Which routine helps check interview readiness?",
    answerB: "Daily mock interview session"
  }),
  {
    id: "data-marathon-python",
    title: "Data Marathon: Python",
    subtitle: "Marathon overview + hacking sheet",
    videoId: "jCDIYPMWWzA",
    intervalSeconds: 0,
    assignmentTitle: "Data Marathon: Python",
    assignmentUrl: classroomAssignmentUrl,
    notes: [
      "Posted 29 Dec 2025.",
      "Due 4 Jan 2026.",
      "Marathon overview video: https://youtu.be/jCDIYPMWWzA",
      "Hacking Sheet: https://docs.google.com/document/d/1TdPVBtqhj37qb2NJFR_cmSNR0XLoZ03dl8vsnKBq9Rg/edit?usp=sharing",
      "Submission Folder: C7-DE / Data Marathon"
    ],
    checkpoints: [
      {
        id: "data-marathon-python-gate-30",
        time: 30,
        type: "quiz",
        title: "Marathon Overview",
        prompt: "What should you review before starting the Data Marathon work?",
        options: ["The marathon overview and hacking sheet", "Only the due date", "A different course", "The browser theme"],
        answer: "The marathon overview and hacking sheet"
      },
      {
        id: "data-marathon-python-gate-90",
        time: 90,
        type: "quiz",
        title: "Submission Folder",
        prompt: "Which folder is listed for Data Marathon submissions?",
        options: ["C7-DE / Data Marathon", "C7-DE / Lecture 1", "Personal Downloads", "Archived Classes"],
        answer: "C7-DE / Data Marathon"
      },
      {
        id: "data-marathon-python-gate-150",
        time: 150,
        type: "assignment",
        title: "Submit Marathon Work",
        prompt: "Submit your Data Marathon work in Google Classroom and the listed submission folder."
      }
    ]
  }
];

const savedAuthConfig = readJSON("authConfig", {});
const authConfig = {
  googleClientId: siteAuthConfig.googleClientId || savedAuthConfig.googleClientId || "",
  allowedEmails: siteAuthConfig.allowedEmails.length > 0
    ? siteAuthConfig.allowedEmails
    : savedAuthConfig.allowedEmails || []
};
const shouldResetLessonState = localStorage.getItem("lessonCatalogVersion") !== lessonCatalogVersion;

const state = {
  player: null,
  poller: null,
  activeGate: null,
  currentLessonIndex: Number(localStorage.getItem("currentLessonIndex") || 0),
  user: readJSON("signedInUser", null),
  lessonState: shouldResetLessonState ? {} : readJSON("lessonState", {}),
  lessons: getStoredLessons()
};

const els = {
  authGate: document.querySelector("#authGate"),
  authStatus: document.querySelector("#authStatus"),
  googleButton: document.querySelector("#googleButton"),
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
  assignmentStatusLabel: document.querySelector("#assignmentStatusLabel"),
  gateModal: document.querySelector("#gateModal"),
  modalType: document.querySelector("#modalType"),
  modalTitle: document.querySelector("#modalTitle"),
  modalContent: document.querySelector("#modalContent"),
  modalActions: document.querySelector("#modalActions"),
  playerFallback: document.querySelector("#playerFallback"),
  notesBadge: document.querySelector("#notesBadge"),
  notesList: document.querySelector("#notesList"),
  openAssignmentBtn: document.querySelector("#openAssignmentBtn"),
  toast: document.querySelector("#toast")
};

normalizeLessonIndex();
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
    renderAssignmentGate(gate);
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

function renderAssignmentGate(gate) {
  const lesson = getCurrentLesson();
  els.modalType.textContent = "Assignment checkpoint";
  els.modalTitle.textContent = gate.title;
  els.modalContent.innerHTML = `
    <p>${escapeHTML(gate.prompt)}</p>
    <p class="assignment-callout">${escapeHTML(lesson.assignmentTitle)} opens in Google Classroom. Return here after you submit.</p>
  `;
  els.modalActions.innerHTML = `
    <button class="ghost-button" id="openAssignmentModalBtn" type="button">Open Assignment</button>
    <button class="secondary-button" id="checkSubmissionBtn" type="button">Check submission</button>
  `;

  document.querySelector("#openAssignmentModalBtn").addEventListener("click", openAssignment);
  document.querySelector("#checkSubmissionBtn").addEventListener("click", () => {
    const progress = getCurrentProgress();
    progress.submissions += 1;
    completeGate(gate);
    showToast("Assignment marked submitted. Resuming the video.");
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
  renderLessonNotes();
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
  els.intervalLabel.textContent = "Custom timestamps";
  els.checkpointList.innerHTML = lesson.checkpoints.map((gate) => {
    const completed = progress.completed.includes(gate.id);
    const active = state.activeGate === gate.id;
    const status = completed ? "Done" : active ? "Paused" : gate.type === "quiz" ? "Quiz" : "Assignment";
    return `
      <article class="checkpoint ${completed ? "completed" : ""} ${active ? "active" : ""}">
        <div class="checkpoint-icon">${completed ? "OK" : formatMinutes(gate.time)}</div>
        <div>
          <strong>${escapeHTML(gate.title)}</strong>
          <small>${gate.type === "quiz" ? "Answer required to resume" : "Assignment submission required"}</small>
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

  document.querySelector(".topbar h1").textContent = lesson.title;
  document.querySelector(".topbar .eyebrow").textContent = "Private Video Series";
  els.progressLabel.textContent = `${completeCount} of ${total} gates`;
  els.progressMeter.style.width = `${percent}%`;
  els.completionBadge.textContent = percent === 100 ? "Completed" : "In progress";
  els.watchPosition.textContent = formatTime(progress.lastTime);
  els.scoreLabel.textContent = `${score}%`;
  els.attemptsLabel.textContent = String(progress.attempts);
  els.submissionsLabel.textContent = String(progress.submissions);
  els.nextGateLabel.textContent = nextGate ? `${nextGate.type === "quiz" ? "Quiz" : "Assignment"} at ${formatTime(nextGate.time)}` : "All gates done";
  els.assignmentStatusLabel.textContent = "Ready";
}

function renderLessonNotes() {
  const lesson = getCurrentLesson();
  els.notesBadge.textContent = lesson.assignmentTitle;
  els.notesList.innerHTML = lesson.notes.map((note) => `<li>${escapeHTML(note)}</li>`).join("");
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
  localStorage.setItem("lessonCatalogVersion", lessonCatalogVersion);
}

function buildLesson(config) {
  const assignmentTitle = config.assignmentTitle || config.title;
  return {
    id: config.id,
    title: config.title,
    subtitle: `${config.focus} + Classroom assignment`,
    videoId: config.videoId,
    intervalSeconds: 0,
    assignmentTitle,
    assignmentUrl: classroomAssignmentUrl,
    notes: [
      config.posted,
      config.due,
      `Video: https://youtu.be/${config.videoId}`,
      ...(config.extraNotes || []),
      ...taskNotes
    ],
    checkpoints: [
      {
        id: `${config.id}-gate-30`,
        time: 30,
        type: "quiz",
        title: "Focus Check",
        prompt: config.quizA,
        options: shuffleChoices([
          config.answerA,
          "Skip the example and continue",
          "Only watch without taking action",
          "Use another student's submission"
        ]),
        answer: config.answerA
      },
      {
        id: `${config.id}-gate-90`,
        time: 90,
        type: "quiz",
        title: "Task Check",
        prompt: config.quizB,
        options: shuffleChoices([
          config.answerB,
          "Keep it only on your desktop",
          "Ignore the assignment notes",
          "Wait until the course ends"
        ]),
        answer: config.answerB
      },
      {
        id: `${config.id}-gate-150`,
        time: 150,
        type: "assignment",
        title: "Classroom Submission",
        prompt: `Complete the ${assignmentTitle} work, then submit or update it in Google Classroom.`
      }
    ]
  };
}

function shuffleChoices(choices) {
  const [answer, ...rest] = choices;
  const rotation = answer.length % choices.length;
  const mixed = [...rest.slice(rotation), answer, ...rest.slice(0, rotation)];
  return mixed;
}

function openAssignment() {
  window.open(getCurrentLesson().assignmentUrl, "_blank", "noopener,noreferrer");
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

function getStoredLessons() {
  if (shouldResetLessonState) {
    localStorage.setItem("lessons", JSON.stringify(defaultLessons));
    localStorage.setItem("lessonCatalogVersion", lessonCatalogVersion);
    localStorage.removeItem("lessonState");
    return defaultLessons;
  }

  return readJSON("lessons", defaultLessons);
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

document.querySelector("#openAssignmentBtn").addEventListener("click", openAssignment);
document.querySelector("#switchAccountBtn").addEventListener("click", signOut);
els.gateModal.addEventListener("cancel", (event) => {
  if (state.activeGate) {
    event.preventDefault();
    showToast("Complete this checkpoint to continue.");
  }
});
