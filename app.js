const firebaseConfig = {
  apiKey: "AIzaSyCQNCEc4YyZDqJbK_V6QeFxj7LpiYBzO2Q",
  authDomain: "pbde-lms.firebaseapp.com",
  projectId: "pbde-lms",
  storageBucket: "pbde-lms.firebasestorage.app",
  messagingSenderId: "138158464844",
  appId: "1:138158464844:web:4cfb4ec494a447250b79e9",
  measurementId: "G-TGZPE43QMH"
};

const firebasePaths = {
  catalog: {
    collection: "lms",
    document: "courseCatalog"
  },
  schedule: {
    collection: "lms",
    document: "lessonSchedule"
  },
  users: "users",
  progress: "progress"
};

const appBuildVersion = "20260722-groups-v1";
const programName = "Prasad Boyane Data Engg";
const coachWhatsAppNumber = "";
const whatsappBaseUrl = coachWhatsAppNumber ? `https://wa.me/${coachWhatsAppNumber}` : "https://wa.me/";
if (localStorage.getItem("appBuildVersion") !== appBuildVersion) {
  localStorage.removeItem("signedInUser");
  localStorage.removeItem("courseTopics");
  localStorage.removeItem("lessons");
  localStorage.removeItem("lessonCatalogVersion");
  localStorage.removeItem("lessonSchedule");
  localStorage.setItem("appBuildVersion", appBuildVersion);
}

const state = {
  player: null,
  poller: null,
  firestore: null,
  firebaseAuth: null,
  firebaseReady: false,
  firebaseAuthResolved: false,
  youtubeReady: false,
  catalogLoaded: false,
  activeGate: null,
  currentLessonIndex: Number(localStorage.getItem("currentLessonIndex") || 0),
  user: null,
  lessonState: readJSON("lessonState", {}),
  topics: [],
  lessons: [],
  openPlaylists: readJSON("openPlaylists", { python: true }),
  openLessonGroups: readJSON("openLessonGroups", {}),
  lessonSchedule: {},
  activityDates: [],
  leaderboard: [],
  progressSaveTimer: null,
  progressSaving: false
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
  gamificationStack: document.querySelector("#gamificationStack"),
  leaderboardStatus: document.querySelector("#leaderboardStatus"),
  leaderboardList: document.querySelector("#leaderboardList"),
  nextGateLabel: document.querySelector("#nextGateLabel"),
  assignmentStatusLabel: document.querySelector("#assignmentStatusLabel"),
  gateModal: document.querySelector("#gateModal"),
  modalType: document.querySelector("#modalType"),
  modalTitle: document.querySelector("#modalTitle"),
  modalContent: document.querySelector("#modalContent"),
  modalActions: document.querySelector("#modalActions"),
  accessDeniedModal: document.querySelector("#accessDeniedModal"),
  accessDeniedMessage: document.querySelector("#accessDeniedMessage"),
  playerFrame: document.querySelector(".player-frame"),
  materialPanel: document.querySelector("#materialPanel"),
  materialEyebrow: document.querySelector("#materialEyebrow"),
  materialTitle: document.querySelector("#materialTitle"),
  materialDescription: document.querySelector("#materialDescription"),
  materialList: document.querySelector("#materialList"),
  playerFallback: document.querySelector("#playerFallback"),
  notesBadge: document.querySelector("#notesBadge"),
  notesList: document.querySelector("#notesList"),
  openAssignmentBtn: document.querySelector("#openAssignmentBtn"),
  studentHeaderActions: document.querySelector("#studentHeaderActions"),
  aboutProgramBtn: document.querySelector("#aboutProgramBtn"),
  aboutProgramModal: document.querySelector("#aboutProgramModal"),
  shareProgressBtn: document.querySelector("#shareProgressBtn"),
  coachChatBtn: document.querySelector("#coachChatBtn"),
  scheduleLessonBtn: document.querySelector("#scheduleLessonBtn"),
  scheduleModal: document.querySelector("#scheduleModal"),
  scheduleLessonSelect: document.querySelector("#scheduleLessonSelect"),
  scheduleDateInput: document.querySelector("#scheduleDateInput"),
  scheduleTimeInput: document.querySelector("#scheduleTimeInput"),
  scheduleStatusText: document.querySelector("#scheduleStatusText"),
  schedulePreview: document.querySelector("#schedulePreview"),
  saveScheduleBtn: document.querySelector("#saveScheduleBtn"),
  clearScheduleBtn: document.querySelector("#clearScheduleBtn"),
  toast: document.querySelector("#toast")
};

normalizeLessonIndex();
renderAuthState();
render();
initializeFirebaseSync();

const youtubeApiTimer = window.setTimeout(() => {
  if (!state.player && isVideoLesson(getCurrentLesson())) {
    showToast("YouTube player is taking longer than expected. Check network access or the video ID.");
  }
}, 9000);

window.onYouTubeIframeAPIReady = () => {
  state.youtubeReady = true;
  ensureYouTubePlayer();
};

function ensureYouTubePlayer() {
  if (!state.youtubeReady || state.player) return;

  const lesson = getCurrentLesson();
  if (!lesson) {
    renderEmptyLessonState();
    return;
  }
  if (!isVideoLesson(lesson)) return;
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
}

window.addEventListener("load", () => {
  initializeGoogleSignIn();
});

function initializeGoogleSignIn() {
  if (!state.firebaseAuth) {
    els.authStatus.textContent = "Firebase Google sign-in is loading.";
    window.setTimeout(initializeGoogleSignIn, 500);
    return;
  }

  els.googleButton.innerHTML = "";
  const button = document.createElement("button");
  button.className = "google-login-button";
  button.type = "button";
  button.textContent = "Sign in via Google";
  button.addEventListener("click", handleFirebaseGoogleSignIn);
  els.googleButton.append(button);
  els.authStatus.textContent = "Google authentication checks your Firebase whitelist access.";
}

async function handleFirebaseGoogleSignIn() {
  if (!state.firebaseAuth) {
    showAccessDenied("Firebase Google authentication is not ready yet. Please wait a moment and try again.");
    return;
  }

  try {
    const provider = new window.firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await state.firebaseAuth.signInWithPopup(provider);
    await applySignedInProfile(result.user);
  } catch (error) {
    console.warn("Firebase Google sign-in failed", error);
    showAccessDenied(getFirebaseAuthMessage(error));
  }
}

async function applySignedInProfile(profile) {
  if (!profile?.email || profile.emailVerified === false) {
    await state.firebaseAuth?.signOut();
    showAccessDenied("Google authentication did not return a verified Gmail account.");
    return;
  }

  const userRecord = await loadUserRecord(profile.email);
  if (!userRecord?.active || !userRecord.role) {
    await state.firebaseAuth?.signOut();
    showAccessDenied(`${profile.email} is not whitelisted in Firebase for this LMS.`);
    return;
  }

  state.user = {
    email: userRecord.email || profile.email,
    name: profile.displayName || profile.name || profile.email,
    picture: profile.photoURL || profile.picture || "",
    role: userRecord.role
  };
  await loadCourseCatalogFromCloud();
  await loadLearnerProgressFromCloud();
  await loadLessonScheduleFromCloud();
  await loadLeaderboardFromCloud();
  normalizeLessonIndex();
  renderAuthState();
  render();
  showToast(`Signed in as ${state.user.email}`);
}

function renderAuthState() {
  if (state.user?.email) {
    if (!state.user.role) {
      state.user = null;
      clearPrivateSessionData();
      els.authGate.classList.remove("hidden");
      els.studentEmail.textContent = "Not signed in";
      els.studentHeaderActions.classList.add("hidden");
      els.scheduleLessonBtn.classList.add("hidden");
      return;
    }

    els.authGate.classList.add("hidden");
    els.studentEmail.textContent = `${state.user.email} (${getRoleLabel()})`;
    els.studentHeaderActions.classList.toggle("hidden", !isStudent());
    els.scheduleLessonBtn.classList.toggle("hidden", !isTeacher());
    return;
  }

  els.authGate.classList.remove("hidden");
  els.studentEmail.textContent = "Not signed in";
  els.studentHeaderActions.classList.add("hidden");
  els.scheduleLessonBtn.classList.add("hidden");
}

function showAuthError(message) {
  els.authStatus.textContent = message;
  showToast(message);
}

function showAccessDenied(message) {
  els.authStatus.textContent = message;
  els.accessDeniedMessage.textContent = message;
  if (els.accessDeniedModal.open) {
    els.accessDeniedModal.close();
  }
  els.accessDeniedModal.showModal();
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
  if (!state.player) return;

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
  if (!isVideoLesson(lesson)) return;
  const progress = getCurrentProgress();
  const currentTime = Math.floor(state.player.getCurrentTime());
  progress.lastTime = currentTime;
  saveLessonState();

  const checkpoints = getLessonCheckpoints(lesson);
  const skippedGate = checkpoints.find((gate) => {
    const gateTime = getGateTime(gate);
    return gateTime < currentTime && !progress.completed.includes(gate.id);
  });

  if (skippedGate) {
    state.player.seekTo(Math.max(getGateTime(skippedGate) - 1, 0), true);
    openGate(skippedGate);
    return;
  }

  const reachedGate = checkpoints.find((gate) => {
    return currentTime >= getGateTime(gate) && !progress.completed.includes(gate.id);
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
    registerLearningActivity();

    if (selected.value !== gate.answer) {
      saveLessonState();
      showToast("Not quite. Try again before the lesson resumes.");
      render();
      return;
    }

    progress.correct += 1;
    completeGate(gate);
    saveLearnerProgressToCloud();
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
    registerLearningActivity();
    completeGate(gate);
    saveLearnerProgressToCloud();
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
  if (state.player) {
    state.player.playVideo();
  }
}

function render() {
  renderLessonList();
  if (!getCurrentLesson()) {
    renderEmptyLessonState();
    return;
  }
  renderLessonSurface();
  renderCheckpoints();
  renderStats();
  renderGamification();
  renderLeaderboard();
  renderLessonNotes();
}

function renderLessonList() {
  if (state.user?.email && state.topics.length === 0) {
    els.lessonList.innerHTML = `
      <section class="playlist-group">
        <div class="empty-playlist-link">Loading course catalog...</div>
      </section>
    `;
    return;
  }

  els.lessonList.innerHTML = state.topics.map((playlist) => {
    const lessons = getVisibleLessonEntries()
      .filter(({ lesson }) => lesson.playlistId === playlist.id);
    const lessonRows = getLessonRows(lessons);
    const isOpen = Boolean(state.openPlaylists[playlist.id]);

    return `
      <section class="playlist-group">
        <button class="playlist-toggle ${isOpen ? "open" : ""}" type="button" data-playlist-id="${playlist.id}" aria-expanded="${isOpen}">
          <span>${isOpen ? "−" : "+"}</span>
          <div>
            <strong>${escapeHTML(playlist.title)}</strong>
            <small>${lessonRows.length} ${lessonRows.length === 1 ? "lesson" : "lessons"} / ${lessons.length} ${lessons.length === 1 ? "session" : "sessions"}</small>
          </div>
        </button>
        <div class="playlist-lessons ${isOpen ? "open" : ""}">
          ${lessonRows.length > 0 ? lessonRows.map((row, rowIndex) => renderLessonRow(row, rowIndex)).join("") : `
            <a class="empty-playlist-link" href="${escapeHTML(playlist.url)}" target="_blank" rel="noopener noreferrer">
              Open Classroom topic
            </a>
          `}
        </div>
      </section>
    `;
  }).join("");

  els.lessonList.querySelectorAll(".playlist-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const playlistId = button.dataset.playlistId;
      state.openPlaylists[playlistId] = !state.openPlaylists[playlistId];
      localStorage.setItem("openPlaylists", JSON.stringify(state.openPlaylists));
      renderLessonList();
    });
  });

  els.lessonList.querySelectorAll(".lecture-group-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const groupKey = button.dataset.lessonGroupKey;
      state.openLessonGroups[groupKey] = !isLessonGroupOpen(groupKey, getGroupedLessonIndexes(groupKey));
      localStorage.setItem("openLessonGroups", JSON.stringify(state.openLessonGroups));
      renderLessonList();
    });
  });

  els.lessonList.querySelectorAll(".lesson-item").forEach((button) => {
    button.addEventListener("click", () => switchLesson(Number(button.dataset.lessonIndex)));
  });
}

function renderLessonRow(row, rowIndex) {
  const rowNumber = String(rowIndex + 1).padStart(2, "0");
  if (row.type === "lesson") {
    return renderLessonButton(row.entry, rowNumber);
  }

  const indexes = row.entries.map(({ index }) => index);
  const isOpen = isLessonGroupOpen(row.key, indexes);
  const active = indexes.includes(state.currentLessonIndex);
  return `
    <section class="lecture-group ${active ? "active" : ""}">
      <button class="lecture-group-toggle" type="button" data-lesson-group-key="${escapeHTML(row.key)}" aria-expanded="${isOpen}">
        <span>${isOpen ? "−" : "+"}</span>
        <div>
          <strong>${escapeHTML(row.title)}</strong>
          <small>${row.entries.length} linked sessions</small>
        </div>
        <b>${rowNumber}</b>
      </button>
      <div class="lecture-parts ${isOpen ? "open" : ""}">
        ${row.entries.map((entry, partIndex) => renderLessonButton(entry, `P${partIndex + 1}`, true)).join("")}
      </div>
    </section>
  `;
}

function renderLessonButton({ lesson, index }, marker, isPart = false) {
  return `
    <button class="lesson-item ${isPart ? "lesson-part" : ""} ${index === state.currentLessonIndex ? "active" : ""}" type="button" data-lesson-index="${index}">
      <span>${escapeHTML(marker)}</span>
      <div>
        <strong>${escapeHTML(isPart ? getLessonPartTitle(lesson) : lesson.title)}</strong>
        <small>${escapeHTML(getLessonMeta(lesson))}</small>
      </div>
    </button>
  `;
}

function getLessonRows(entries) {
  const rows = [];
  const groupMap = new Map();

  entries.forEach((entry) => {
    const group = getLectureGroup(entry.lesson);
    if (!group) {
      rows.push({ type: "lesson", entry });
      return;
    }

    if (!groupMap.has(group.key)) {
      const row = { type: "group", key: group.key, title: group.title, entries: [] };
      groupMap.set(group.key, row);
      rows.push(row);
    }
    groupMap.get(group.key).entries.push(entry);
  });

  return rows.flatMap((row) => {
    if (row.type !== "group" || row.entries.length < 2) {
      return row.type === "group" ? row.entries.map((entry) => ({ type: "lesson", entry })) : [row];
    }
    return [row];
  });
}

function getLectureGroup(lesson) {
  if (isMaterialLesson(lesson)) return null;
  const match = String(lesson.title || "").match(/^(.*?\bLecture\s+\d+)\b/i);
  if (!match) return null;
  const title = match[1].replace(/\s+/g, " ").trim();
  return {
    title,
    key: `${lesson.playlistId}:${title.toLowerCase()}`
  };
}

function getLessonPartTitle(lesson) {
  const title = String(lesson.title || "");
  const colonPart = title.split(":").slice(1).join(":").trim();
  if (colonPart) return colonPart;
  const group = getLectureGroup(lesson);
  return group ? title.replace(group.title, "").trim() || lesson.title : lesson.title;
}

function getGroupedLessonIndexes(groupKey) {
  return getVisibleLessonEntries()
    .filter(({ lesson }) => getLectureGroup(lesson)?.key === groupKey)
    .map(({ index }) => index);
}

function isLessonGroupOpen(groupKey, indexes) {
  if (indexes.includes(state.currentLessonIndex)) return true;
  return Boolean(state.openLessonGroups[groupKey]);
}

function getPlaylistTitle(playlistId) {
  return state.topics.find((playlist) => playlist.id === playlistId)?.title || "Private Video Series";
}

function getPlaylistUrl(playlistId) {
  return state.topics.find((playlist) => playlist.id === playlistId)?.url || "#";
}

function getLessonAssignmentUrl(lesson) {
  return lesson.assignmentUrl || getPlaylistUrl(lesson.playlistId);
}

function getVisibleLessonEntries() {
  return state.lessons
    .map((lesson, index) => ({ lesson, index }))
    .filter(({ lesson }) => canAccessLesson(lesson));
}

function canAccessLesson(lesson) {
  if (isTeacher()) return true;
  return isLessonPublished(lesson.id);
}

function isLessonPublished(lessonId) {
  const publishedAt = getPublishedAt(lessonId);
  return Number.isFinite(publishedAt) && publishedAt <= Date.now();
}

function getLessonMeta(lesson) {
  if (!isTeacher()) return lesson.subtitle;
  return getScheduleStateLabel(lesson);
}

function getScheduleStateLabel(lesson) {
  const publishedAt = getPublishedAt(lesson.id);
  if (publishedAt <= Date.now()) {
    return `Visible - ${formatSchedule(publishedAt)}`;
  }
  if (state.lessonSchedule[lesson.id]) {
    return `Scheduled - ${formatSchedule(publishedAt)}`;
  }
  return "Hidden from students";
}

function renderCheckpoints() {
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  const checkpoints = getLessonCheckpoints(lesson);
  if (isMaterialLesson(lesson)) {
    els.intervalLabel.textContent = "Before lessons";
    els.checkpointList.innerHTML = `
      <article class="checkpoint material-checkpoint">
        <div class="checkpoint-icon">Files</div>
        <div>
          <strong>Download and review study material</strong>
          <small>Open the section pack and keep notes ready before starting videos.</small>
        </div>
        <span class="pill">Material</span>
      </article>
    `;
    return;
  }

  els.intervalLabel.textContent = checkpoints.length ? "Spread across video" : "No gates";
  els.checkpointList.innerHTML = checkpoints.length ? checkpoints.map((gate) => {
    const completed = progress.completed.includes(gate.id);
    const active = state.activeGate === gate.id;
    const status = completed ? "Done" : active ? "Paused" : gate.type === "quiz" ? "Quiz" : "Assignment";
    const gateTime = getGateTime(gate);
    return `
      <article class="checkpoint ${completed ? "completed" : ""} ${active ? "active" : ""}">
        <div class="checkpoint-icon">${completed ? "OK" : formatMinutes(gateTime)}</div>
        <div>
          <strong>${escapeHTML(gate.title)}</strong>
          <small>${gate.type === "quiz" ? "Answer required to resume" : "Assignment submission required"}</small>
        </div>
        <span class="pill">${status}</span>
      </article>
    `;
  }).join("") : `
    <article class="checkpoint material-checkpoint">
      <div class="checkpoint-icon">Ready</div>
      <div>
        <strong>No checkpoints for this lesson</strong>
        <small>Watch the video and use the notes panel for guidance.</small>
      </div>
      <span class="pill">Open</span>
    </article>
  `;
}

function renderStats() {
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  const checkpoints = getLessonCheckpoints(lesson);
  const total = checkpoints.length;
  const completeCount = progress.completed.length;
  const percent = total ? Math.round((completeCount / total) * 100) : 0;
  const score = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const nextGate = checkpoints.find((gate) => !progress.completed.includes(gate.id));

  document.querySelector(".topbar h1").textContent = lesson.title;
  document.querySelector(".topbar .eyebrow").textContent = getPlaylistTitle(lesson.playlistId);
  els.progressLabel.textContent = isMaterialLesson(lesson) ? "Study pack" : `${completeCount} of ${total} gates`;
  els.progressMeter.style.width = `${percent}%`;
  els.completionBadge.textContent = isMaterialLesson(lesson) ? "Material" : percent === 100 ? "Completed" : "In progress";
  els.watchPosition.textContent = isMaterialLesson(lesson) ? "Files" : formatTime(progress.lastTime);
  els.scoreLabel.textContent = `${score}%`;
  els.attemptsLabel.textContent = String(progress.attempts);
  els.submissionsLabel.textContent = String(progress.submissions);
  els.nextGateLabel.textContent = isMaterialLesson(lesson)
    ? "Download study material"
    : nextGate ? `${nextGate.type === "quiz" ? "Quiz" : "Assignment"} at ${formatTime(getGateTime(nextGate))}` : "All gates done";
  els.assignmentStatusLabel.textContent = isMaterialLesson(lesson) ? "Drive links" : "Ready";
}

function renderGamification() {
  const summary = getGamificationSummary();
  els.gamificationStack.innerHTML = `
    <div class="xp-card">
      <div>
        <span class="label">XP</span>
        <strong>${summary.xp.toLocaleString()}</strong>
      </div>
      <div>
        <span class="label">Level</span>
        <strong>${summary.level}</strong>
      </div>
      <div>
        <span class="label">Streak</span>
        <strong>${summary.streakDays}d</strong>
      </div>
    </div>
    <div class="level-meter" aria-label="Level progress">
      <span style="width: ${summary.levelProgress}%"></span>
    </div>
    <details class="status-details">
      <summary>⭐ XP + Levels</summary>
      <p>${summary.xpToNext} XP to Level ${summary.level + 1}. XP includes checkpoints, quiz accuracy, completed lessons, streaks, and badges.</p>
    </details>
    <details class="status-details">
      <summary>🔥 Streak</summary>
      <p>${summary.streakDays > 0 ? `Active for ${summary.streakDays} learning day${summary.streakDays === 1 ? "" : "s"}.` : "Answer a checkpoint to start a streak."}</p>
    </details>
    <details class="status-details" open>
      <summary>🏅 Badges</summary>
      <div class="badge-list">
        ${summary.badges.length ? summary.badges.map((badge) => `<span>${escapeHTML(badge)}</span>`).join("") : "<span>Start learning</span>"}
      </div>
    </details>
  `;
}

function renderLeaderboard() {
  if (!state.user?.email) {
    els.leaderboardList.innerHTML = "";
    return;
  }

  const entries = getLeaderboardEntries();
  els.leaderboardStatus.textContent = entries.length ? `${entries.length} learners` : "No rank";
  els.leaderboardList.innerHTML = entries.length ? entries.map((entry, index) => `
    <article class="leaderboard-row ${entry.email === state.user.email ? "current" : ""}">
      <div class="rank">${index + 1}</div>
      <div class="leader-main">
        <strong>${escapeHTML(entry.name || entry.email)}</strong>
        <small>Lvl ${entry.summary.level} · ${entry.summary.xp.toLocaleString()} XP · 🔥 ${entry.summary.streakDays}d · 🏅 ${entry.summary.badges.length}</small>
        <div class="progress-map" aria-label="Progress map">
          <span style="width: ${entry.summary.completionPercent}%"></span>
        </div>
      </div>
      <div class="leader-score">${entry.rankScore}</div>
    </article>
  `).join("") : `
    <div class="empty-leaderboard">Complete a checkpoint to enter the board.</div>
  `;
}

function renderLessonNotes() {
  const lesson = getCurrentLesson();
  els.notesBadge.textContent = lesson.assignmentTitle || (isMaterialLesson(lesson) ? "Study material" : "Study guide");
  els.notesList.innerHTML = (lesson.notes || []).map((note) => `<li>${escapeHTML(note)}</li>`).join("");
  els.openAssignmentBtn.textContent = isMaterialLesson(lesson) ? "Open Main Material" : "Open Assignment";
}

function renderEmptyLessonState() {
  document.querySelector(".topbar h1").textContent = "No lessons posted yet";
  document.querySelector(".topbar .eyebrow").textContent = isTeacher() ? "Teacher Schedule" : "Student View";
  els.playerFallback.classList.remove("hidden");
  els.playerFrame.classList.remove("hidden");
  els.materialPanel.classList.add("hidden");
  els.playerFallback.innerHTML = `
    <div>
      <span class="play-symbol">Wait</span>
      <strong>No lessons available</strong>
      <p>${isTeacher() ? "Use Schedule Lesson to post videos for students." : "Your teacher has not posted lessons yet."}</p>
    </div>
  `;
  els.checkpointList.innerHTML = "";
  els.progressLabel.textContent = "0 of 0 gates";
  els.progressMeter.style.width = "0%";
  els.completionBadge.textContent = "Waiting";
  els.watchPosition.textContent = "00:00";
  els.scoreLabel.textContent = "0%";
  els.attemptsLabel.textContent = "0";
  els.submissionsLabel.textContent = "0";
  els.gamificationStack.innerHTML = "";
  els.leaderboardStatus.textContent = "Waiting";
  els.leaderboardList.innerHTML = "";
  els.nextGateLabel.textContent = "No posted lesson";
  els.assignmentStatusLabel.textContent = "Hidden";
  els.notesBadge.textContent = "Not posted";
  els.notesList.innerHTML = "<li>Lessons become visible after a teacher schedules a post time.</li>";
}

function switchLesson(index) {
  if (index === state.currentLessonIndex) return;
  if (!canAccessLesson(state.lessons[index])) return;
  state.currentLessonIndex = index;
  localStorage.setItem("currentLessonIndex", String(index));
  state.activeGate = null;
  if (els.gateModal.open) {
    els.gateModal.close();
  }
  const lesson = getCurrentLesson();
  const progress = getCurrentProgress();
  if (state.player) {
    if (isVideoLesson(lesson)) {
      state.player.loadVideoById(lesson.videoId);
      if (progress.lastTime > 0) {
        state.player.seekTo(progress.lastTime, true);
      }
    } else {
      state.player.pauseVideo();
    }
  } else {
    ensureYouTubePlayer();
  }
  render();
}

function resetCurrentLessonProgress() {
  state.lessonState[getCurrentLesson().id] = createEmptyProgress();
  saveLessonState();
}

function getCurrentLesson() {
  normalizeLessonIndex();
  const lesson = state.lessons[state.currentLessonIndex];
  return lesson && canAccessLesson(lesson) ? lesson : undefined;
}

function getCurrentProgress() {
  const lesson = getCurrentLesson();
  if (!lesson) return createEmptyProgress();
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
  scheduleProgressSave();
}

function isMaterialLesson(lesson) {
  return lesson?.type === "material";
}

function isVideoLesson(lesson) {
  return Boolean(lesson && !isMaterialLesson(lesson) && lesson.videoId);
}

function getLessonCheckpoints(lesson) {
  return Array.isArray(lesson?.checkpoints) ? lesson.checkpoints : [];
}

function renderLessonSurface() {
  const lesson = getCurrentLesson();
  if (isMaterialLesson(lesson)) {
    stopPolling();
    if (state.player && typeof state.player.pauseVideo === "function") {
      state.player.pauseVideo();
    }
    els.playerFrame.classList.add("hidden");
    els.playerFallback.classList.add("hidden");
    renderMaterialLesson(lesson);
    return;
  }

  els.materialPanel.classList.add("hidden");
  els.playerFrame.classList.remove("hidden");
  ensureYouTubePlayer();
}

function renderMaterialLesson(lesson) {
  const materials = Array.isArray(lesson.materials) ? lesson.materials : [];
  els.materialPanel.classList.remove("hidden");
  els.materialEyebrow.textContent = getPlaylistTitle(lesson.playlistId);
  els.materialTitle.textContent = lesson.materialTitle || lesson.title;
  els.materialDescription.textContent = lesson.materialDescription || lesson.subtitle || "Download the study material for this section.";
  els.materialList.innerHTML = materials.length ? materials.map((material) => `
    <article class="material-item">
      <div>
        <strong>${escapeHTML(material.name)}</strong>
        <p>${escapeHTML(material.description || "Open this resource in Google Drive.")}</p>
      </div>
      <a class="secondary-button compact-button" href="${escapeHTML(material.url)}" target="_blank" rel="noopener noreferrer">Open</a>
    </article>
  `).join("") : `
    <article class="material-item">
      <div>
        <strong>No material links configured</strong>
        <p>Ask the teacher to add Google Drive resources for this section.</p>
      </div>
    </article>
  `;
}

function registerLearningActivity() {
  const today = getDateKey(new Date());
  if (!state.activityDates.includes(today)) {
    state.activityDates.push(today);
    state.activityDates = state.activityDates.slice(-90);
  }
}

function scheduleProgressSave() {
  if (!state.firestore || !state.firebaseAuth?.currentUser || !state.user?.email) return;
  window.clearTimeout(state.progressSaveTimer);
  state.progressSaveTimer = window.setTimeout(saveLearnerProgressToCloud, 1800);
}

async function saveLearnerProgressToCloud() {
  if (!state.firestore || !state.firebaseAuth?.currentUser || !state.user?.email || state.progressSaving) return false;

  state.progressSaving = true;
  try {
    const summary = getGamificationSummary();
    await state.firestore
      .collection(firebasePaths.progress)
      .doc(state.user.email.toLowerCase())
      .set({
        email: state.user.email.toLowerCase(),
        name: state.user.name || state.user.email,
        role: state.user.role,
        lessonState: state.lessonState,
        activityDates: state.activityDates,
        summary,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    await loadLeaderboardFromCloud();
    renderLeaderboard();
    return true;
  } catch (error) {
    console.warn("Learner progress sync failed", error);
    return false;
  } finally {
    state.progressSaving = false;
  }
}

async function saveLessonSchedule() {
  if (!state.firestore) {
    return {
      synced: false,
      message: "Firebase is not loaded yet."
    };
  }
  if (!state.firebaseAuth?.currentUser) {
    return {
      synced: false,
      message: "Sign out and sign in again with Continue with Google."
    };
  }

  try {
    await state.firestore
      .collection(firebasePaths.schedule.collection)
      .doc(firebasePaths.schedule.document)
      .set({
        schedule: state.lessonSchedule,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy: state.firebaseAuth.currentUser.email || state.user?.email || ""
      }, { merge: true });
    return {
      synced: true,
      message: "Schedule synced to Firebase."
    };
  } catch (error) {
    console.warn("Firebase schedule sync failed", error);
    return {
      synced: false,
      message: getFirebaseSyncMessage(error)
    };
  }
}

function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

function initializeFirebaseSync() {
  if (!hasFirebaseConfig()) return;
  if (!window.firebase?.initializeApp) {
    showToast("Firebase SDK did not load. Schedule sync is offline.");
    return;
  }

  try {
    const app = window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig);
    state.firestore = window.firebase.firestore(app);
    state.firebaseAuth = window.firebase.auth ? window.firebase.auth(app) : null;
    if (state.firebaseAuth) {
      state.firebaseAuth.onAuthStateChanged((user) => {
        state.firebaseAuthResolved = true;
        if (user) {
          applySignedInProfile(user);
          return;
        }

        if (state.user?.email) {
          state.user = null;
          clearPrivateSessionData();
          renderAuthState();
          render();
        }
      });
    }
    state.firebaseReady = true;
  } catch (error) {
    state.firestore = null;
    state.firebaseReady = false;
    showToast("Firebase sync is not configured correctly.");
  }
}

async function loadLessonScheduleFromCloud() {
  if (!state.firestore) return false;

  try {
    const snapshot = await state.firestore
      .collection(firebasePaths.schedule.collection)
      .doc(firebasePaths.schedule.document)
      .get();
    const data = snapshot.exists ? snapshot.data() : null;
    if (data?.schedule && typeof data.schedule === "object") {
      state.lessonSchedule = data.schedule;
      normalizeLessonIndex();
      ensureYouTubePlayer();
      render();
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function loadLearnerProgressFromCloud() {
  if (!state.firestore || !state.user?.email) return false;

  try {
    const snapshot = await state.firestore
      .collection(firebasePaths.progress)
      .doc(state.user.email.toLowerCase())
      .get();
    const data = snapshot.exists ? snapshot.data() : null;
    if (data?.lessonState && typeof data.lessonState === "object") {
      state.lessonState = normalizeLessonState(data.lessonState);
      localStorage.setItem("lessonState", JSON.stringify(state.lessonState));
    } else {
      state.lessonState = {};
      localStorage.removeItem("lessonState");
    }
    state.activityDates = Array.isArray(data?.activityDates)
      ? [...new Set(data.activityDates)].filter(Boolean).slice(-90)
      : [];
    return true;
  } catch (error) {
    console.warn("Learner progress load failed", error);
    return false;
  }
}

async function loadLeaderboardFromCloud() {
  if (!state.firestore || !state.user?.email) return false;

  try {
    const snapshot = await state.firestore.collection(firebasePaths.progress).get();
    state.leaderboard = snapshot.docs
      .map((doc) => ({ email: doc.id, ...doc.data() }))
      .filter((entry) => entry.role === "student" || entry.email === state.user.email.toLowerCase());
    return true;
  } catch (error) {
    console.warn("Leaderboard load failed", error);
    state.leaderboard = [];
    return false;
  }
}

async function loadUserRecord(email) {
  if (!state.firestore || !email) return null;

  try {
    const snapshot = await state.firestore
      .collection(firebasePaths.users)
      .doc(email.toLowerCase())
      .get();
    return snapshot.exists ? snapshot.data() : null;
  } catch (error) {
    console.warn("User role lookup failed", error);
    return null;
  }
}

async function loadCourseCatalogFromCloud() {
  if (!state.firestore) return false;

  try {
    const snapshot = await state.firestore
      .collection(firebasePaths.catalog.collection)
      .doc(firebasePaths.catalog.document)
      .get();
    const data = snapshot.exists ? snapshot.data() : null;
    if (!Array.isArray(data?.topics) || !Array.isArray(data?.lessons)) {
      showToast("Course catalog is not configured.");
      return false;
    }

    state.topics = data.topics;
    state.lessons = data.lessons;
    state.catalogLoaded = true;
    normalizeLessonIndex();
    ensureYouTubePlayer();
    return true;
  } catch (error) {
    console.warn("Course catalog load failed", error);
    showToast("Could not load course catalog.");
    return false;
  }
}

function getFirebaseAuthMessage(error) {
  if (error?.code === "auth/popup-closed-by-user") {
    return "Google sign-in was closed before finishing.";
  }
  if (error?.code === "auth/operation-not-allowed") {
    return "Enable Google provider in Firebase Authentication.";
  }
  if (error?.code === "auth/unauthorized-domain") {
    return "Add this website domain in Firebase Authentication settings.";
  }
  return `Firebase sign-in failed${error?.code ? `: ${error.code}` : ""}.`;
}

function getFirebaseSyncMessage(error) {
  if (error?.code === "permission-denied") {
    return "Firebase denied the write. Check teacher email and Firestore rules.";
  }
  if (error?.code === "unauthenticated") {
    return "Firebase is not signed in. Sign out and sign in again.";
  }
  if (error?.code === "unavailable" || error?.code === "deadline-exceeded") {
    return "Firebase network timed out. Try again.";
  }
  return `Firebase sync failed${error?.code ? `: ${error.code}` : ""}.`;
}

function getGamificationSummary(lessonState = state.lessonState, activityDates = state.activityDates) {
  const totals = getProgressTotals(lessonState);
  const accuracy = totals.attempts ? Math.round((totals.correct / totals.attempts) * 100) : 0;
  const badges = getBadges(totals, activityDates, accuracy);
  const streakDays = getCurrentStreak(activityDates);
  const xp = (totals.completedGates * 10)
    + (totals.correct * 15)
    + (totals.submissions * 20)
    + (totals.completedLessons * 50)
    + (Math.min(streakDays, 10) * 25)
    + (badges.length * 75);
  const level = Math.floor(xp / 500) + 1;
  const levelBase = (level - 1) * 500;
  const levelProgress = Math.min(100, Math.round(((xp - levelBase) / 500) * 100));
  const xpToNext = Math.max(0, (level * 500) - xp);
  const completionPercent = state.lessons.length ? Math.round((totals.completedLessons / state.lessons.length) * 100) : 0;
  const rankScore = xp + (streakDays * 30) + (badges.length * 120) + (accuracy * 2) + (completionPercent * 5);

  return {
    xp,
    level,
    levelProgress,
    xpToNext,
    streakDays,
    badges,
    accuracy,
    completedLessons: totals.completedLessons,
    totalLessons: state.lessons.length,
    completedGates: totals.completedGates,
    attempts: totals.attempts,
    correct: totals.correct,
    submissions: totals.submissions,
    completionPercent,
    rankScore
  };
}

function getProgressTotals(lessonState) {
  return state.lessons.reduce((totals, lesson) => {
    const progress = lessonState[lesson.id] || createEmptyProgress();
    const completed = Array.isArray(progress.completed) ? progress.completed.length : 0;
    const checkpoints = getLessonCheckpoints(lesson);
    const lessonDone = checkpoints.length > 0 && completed >= checkpoints.length;
    totals.completedGates += completed;
    totals.completedLessons += lessonDone ? 1 : 0;
    totals.attempts += Number(progress.attempts) || 0;
    totals.correct += Number(progress.correct) || 0;
    totals.submissions += Number(progress.submissions) || 0;
    return totals;
  }, {
    completedGates: 0,
    completedLessons: 0,
    attempts: 0,
    correct: 0,
    submissions: 0
  });
}

function getBadges(totals, activityDates, accuracy) {
  const badges = [];
  if (totals.completedGates > 0) badges.push("🚀 First Gate");
  if (totals.completedLessons > 0) badges.push("🏁 Lesson Finisher");
  if (totals.completedLessons >= 5) badges.push("🧭 Path Builder");
  if (totals.attempts >= 10 && accuracy >= 80) badges.push("🎯 Quiz Master");
  if (getCurrentStreak(activityDates) >= 3) badges.push("🔥 Streak Keeper");
  if (totals.completedGates >= 50) badges.push("💪 Consistent Learner");
  return badges;
}

function getLeaderboardEntries() {
  const entries = [...state.leaderboard];
  if (state.user?.email && !entries.some((entry) => entry.email === state.user.email.toLowerCase())) {
    entries.push({
      email: state.user.email.toLowerCase(),
      name: state.user.name,
      role: state.user.role,
      lessonState: state.lessonState,
      activityDates: state.activityDates
    });
  }

  return entries
    .map((entry) => {
      const summary = getGamificationSummary(
        normalizeLessonState(entry.lessonState || {}),
        Array.isArray(entry.activityDates) ? entry.activityDates : []
      );
      return {
        ...entry,
        summary,
        rankScore: Math.round(summary.rankScore)
      };
    })
    .sort((a, b) => b.rankScore - a.rankScore || b.summary.xp - a.summary.xp)
    .slice(0, 10);
}

function normalizeLessonState(lessonState) {
  return Object.fromEntries(Object.entries(lessonState || {}).map(([lessonId, progress]) => [lessonId, {
    completed: Array.isArray(progress?.completed) ? progress.completed : [],
    attempts: Number(progress?.attempts) || 0,
    correct: Number(progress?.correct) || 0,
    submissions: Number(progress?.submissions) || 0,
    lastTime: Number(progress?.lastTime) || 0
  }]));
}

function getCurrentStreak(activityDates) {
  const dates = new Set((activityDates || []).filter(Boolean));
  let streak = 0;
  const cursor = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (!dates.has(getDateKey(cursor)) && dates.has(getDateKey(yesterday))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dates.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getPublishedAt(lessonId) {
  const value = state.lessonSchedule[lessonId];
  if (value === undefined || value === null || value === "") {
    return Number.POSITIVE_INFINITY;
  }

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : Number.POSITIVE_INFINITY;
}

function formatSchedule(timestamp) {
  if (!Number.isFinite(timestamp)) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

function getGateTime(gate) {
  const fallbackTime = Number(gate.time);
  const fallback = Number.isFinite(fallbackTime) ? fallbackTime : 60;
  const percent = Number(gate.timePercent);
  const duration = getVideoDuration();

  if (!Number.isFinite(percent) || !Number.isFinite(duration) || duration <= 0) {
    return fallback;
  }

  const minimum = Math.min(30, Math.max(5, Math.floor(duration * 0.08)));
  const maximum = Math.max(minimum + 1, Math.floor(duration * 0.92));
  const calculated = Math.floor(duration * (percent / 100));
  return Math.min(Math.max(calculated, minimum), maximum);
}

function getVideoDuration() {
  if (!state.player || typeof state.player.getDuration !== "function") return 0;
  const duration = Number(state.player.getDuration());
  return Number.isFinite(duration) ? duration : 0;
}

function isTeacher() {
  return state.user?.role === "teacher";
}

function isStudent() {
  return state.user?.role === "student";
}

function getRoleLabel() {
  return isTeacher() ? "Teacher" : "Student";
}

function openAssignment() {
  const lesson = getCurrentLesson();
  if (!lesson) {
    showToast("No assignment is posted yet.");
    return;
  }
  if (isMaterialLesson(lesson)) {
    const firstMaterialUrl = Array.isArray(lesson.materials) ? lesson.materials[0]?.url : "";
    if (!firstMaterialUrl) {
      showToast("No material link is configured yet.");
      return;
    }
    window.open(firstMaterialUrl, "_blank", "noopener,noreferrer");
    return;
  }
  window.open(getLessonAssignmentUrl(lesson), "_blank", "noopener,noreferrer");
}

function openAboutProgram() {
  els.aboutProgramModal.showModal();
}

function shareProgressOnWhatsApp() {
  const lesson = getCurrentLesson();
  const summary = getGamificationSummary();
  const message = [
    `Hi Prasad, sharing my ${programName} progress:`,
    `Level ${summary.level} with ${summary.xp} XP`,
    `${summary.streakDays}-day streak`,
    `${summary.completedLessons}/${summary.totalLessons} lessons completed`,
    `${summary.badges.length} badges earned`,
    lesson ? `Current lesson: ${lesson.title}` : "Current lesson: Not posted yet"
  ].join("\n");

  openWhatsAppMessage(message);
}

function openCoachChat() {
  const lesson = getCurrentLesson();
  const message = lesson
    ? `Hi Prasad, I have a doubt in ${programName} - ${lesson.title}.`
    : `Hi Prasad, I have a doubt in ${programName}.`;
  openWhatsAppMessage(message);
}

function openWhatsAppMessage(message) {
  window.open(`${whatsappBaseUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function openScheduleModal() {
  if (!isTeacher()) return;
  renderScheduleOptions();
  const lesson = getCurrentLesson() || state.lessons[0];
  els.scheduleLessonSelect.value = lesson.id;
  fillScheduleInputs(lesson.id);
  els.scheduleModal.showModal();
}

function renderScheduleOptions() {
  els.scheduleLessonSelect.innerHTML = state.lessons.map((lesson) => `
    <option value="${escapeHTML(lesson.id)}">${escapeHTML(getPlaylistTitle(lesson.playlistId))} / ${escapeHTML(lesson.title)} - ${escapeHTML(getScheduleStateLabel(lesson))}</option>
  `).join("");
}

function fillScheduleInputs(lessonId) {
  const timestamp = getPublishedAt(lessonId);
  if (!Number.isFinite(timestamp)) {
    els.scheduleDateInput.value = "";
    els.scheduleTimeInput.value = "";
    els.scheduleStatusText.textContent = "This lesson is hidden from students.";
    renderSchedulePreview();
    return;
  }

  const date = new Date(timestamp);
  els.scheduleDateInput.value = toDateInputValue(date);
  els.scheduleTimeInput.value = toTimeInputValue(date);
  els.scheduleStatusText.textContent = `Students can see this lesson from ${formatSchedule(timestamp)}.`;
  renderSchedulePreview();
}

async function saveScheduleFromModal() {
  const lessonId = els.scheduleLessonSelect.value;
  if (!lessonId || !els.scheduleDateInput.value || !els.scheduleTimeInput.value) {
    showToast("Choose a lesson, date, and time.");
    return;
  }

  const timestamp = new Date(`${els.scheduleDateInput.value}T${els.scheduleTimeInput.value}`).getTime();
  if (!Number.isFinite(timestamp)) {
    showToast("Choose a valid schedule time.");
    return;
  }

  const scheduledLessons = scheduleLessonSequence(lessonId, timestamp, 3);
  localStorage.setItem("lessonSchedule", JSON.stringify(state.lessonSchedule));
  renderScheduleOptions();
  els.scheduleLessonSelect.value = lessonId;
  fillScheduleInputs(lessonId);
  normalizeLessonIndex();
  render();
  els.scheduleModal.close();
  showToast(`${scheduledLessons} lesson${scheduledLessons === 1 ? "" : "s"} scheduled. Syncing...`);

  const syncResult = await saveLessonSchedule();
  showToast(syncResult.message);
}

async function clearScheduleFromModal() {
  const lessonId = els.scheduleLessonSelect.value;
  delete state.lessonSchedule[lessonId];
  localStorage.setItem("lessonSchedule", JSON.stringify(state.lessonSchedule));
  normalizeLessonIndex();
  render();
  els.scheduleModal.close();
  showToast("Lesson hidden. Syncing...");

  const syncResult = await saveLessonSchedule();
  showToast(syncResult.message);
}

function getLessonSequence(lessonId, followUpCount) {
  const startIndex = state.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (startIndex < 0) return [];

  return state.lessons.slice(startIndex, startIndex + followUpCount + 1);
}

function scheduleLessonSequence(lessonId, startTimestamp, followUpCount) {
  const lessonsToSchedule = getLessonSequence(lessonId, followUpCount);

  lessonsToSchedule.forEach((lesson, offset) => {
    state.lessonSchedule[lesson.id] = addDays(startTimestamp, offset);
  });
  return lessonsToSchedule.length;
}

function renderSchedulePreview() {
  const lessonId = els.scheduleLessonSelect.value;
  const lessonsToSchedule = getLessonSequence(lessonId, 3);
  const hasDraftTime = els.scheduleDateInput.value && els.scheduleTimeInput.value;
  const startTimestamp = hasDraftTime
    ? new Date(`${els.scheduleDateInput.value}T${els.scheduleTimeInput.value}`).getTime()
    : NaN;

  if (lessonsToSchedule.length === 0) {
    els.schedulePreview.innerHTML = "";
    return;
  }

  els.schedulePreview.innerHTML = lessonsToSchedule.map((lesson, offset) => {
    const label = Number.isFinite(startTimestamp)
      ? formatSchedule(addDays(startTimestamp, offset))
      : getScheduleStateLabel(lesson);
    return `
      <div>
        <strong>${escapeHTML(lesson.title)}</strong>
        <span>${escapeHTML(label)}</span>
      </div>
    `;
  }).join("");
}

function addDays(timestamp, days) {
  const date = new Date(timestamp);
  date.setDate(date.getDate() + days);
  return date.getTime();
}

function toDateInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toTimeInputValue(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

async function signOut() {
  window.clearTimeout(state.progressSaveTimer);
  await saveLearnerProgressToCloud();
  state.user = null;
  clearPrivateSessionData();
  if (state.player) {
    state.player.pauseVideo();
  }
  if (state.firebaseAuth?.currentUser) {
    state.firebaseAuth.signOut();
  }
  renderAuthState();
  showToast("Signed out.");
}

function clearPrivateSessionData() {
  state.topics = [];
  state.lessons = [];
  state.lessonSchedule = {};
  state.lessonState = {};
  state.activityDates = [];
  state.leaderboard = [];
  state.catalogLoaded = false;
  localStorage.removeItem("signedInUser");
  localStorage.removeItem("courseTopics");
  localStorage.removeItem("lessons");
  localStorage.removeItem("lessonCatalogVersion");
  localStorage.removeItem("lessonSchedule");
  localStorage.removeItem("lessonState");
}

function normalizeLessonIndex() {
  const visibleEntries = getVisibleLessonEntries();
  const currentIsVisible = visibleEntries.some(({ index }) => index === state.currentLessonIndex);

  if (!Number.isInteger(state.currentLessonIndex) || !state.lessons[state.currentLessonIndex] || !currentIsVisible) {
    state.currentLessonIndex = visibleEntries[0]?.index ?? 0;
    localStorage.setItem("currentLessonIndex", String(state.currentLessonIndex));
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
document.querySelector("#aboutProgramBtn").addEventListener("click", openAboutProgram);
document.querySelector("#shareProgressBtn").addEventListener("click", shareProgressOnWhatsApp);
document.querySelector("#coachChatBtn").addEventListener("click", openCoachChat);
document.querySelector("#scheduleLessonBtn").addEventListener("click", openScheduleModal);
document.querySelector("#scheduleLessonSelect").addEventListener("change", (event) => fillScheduleInputs(event.target.value));
document.querySelector("#scheduleDateInput").addEventListener("input", renderSchedulePreview);
document.querySelector("#scheduleTimeInput").addEventListener("input", renderSchedulePreview);
document.querySelector("#saveScheduleBtn").addEventListener("click", saveScheduleFromModal);
document.querySelector("#clearScheduleBtn").addEventListener("click", clearScheduleFromModal);
els.gateModal.addEventListener("cancel", (event) => {
  if (state.activeGate) {
    event.preventDefault();
    showToast("Complete this checkpoint to continue.");
  }
});
