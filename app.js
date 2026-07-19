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
  users: "users"
};

const appBuildVersion = "20260719-access-denied-v1";
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
  lessonSchedule: {}
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
  accessDeniedModal: document.querySelector("#accessDeniedModal"),
  accessDeniedMessage: document.querySelector("#accessDeniedMessage"),
  playerFallback: document.querySelector("#playerFallback"),
  notesBadge: document.querySelector("#notesBadge"),
  notesList: document.querySelector("#notesList"),
  openAssignmentBtn: document.querySelector("#openAssignmentBtn"),
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
  if (!state.player && getCurrentLesson()) {
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
  await loadLessonScheduleFromCloud();
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
      els.scheduleLessonBtn.classList.add("hidden");
      return;
    }

    els.authGate.classList.add("hidden");
    els.studentEmail.textContent = `${state.user.email} (${getRoleLabel()})`;
    els.scheduleLessonBtn.classList.toggle("hidden", !isTeacher());
    return;
  }

  els.authGate.classList.remove("hidden");
  els.studentEmail.textContent = "Not signed in";
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
  if (!lesson) return;
  const progress = getCurrentProgress();
  const currentTime = Math.floor(state.player.getCurrentTime());
  progress.lastTime = currentTime;
  saveLessonState();

  const skippedGate = lesson.checkpoints.find((gate) => {
    const gateTime = getGateTime(gate);
    return gateTime < currentTime && !progress.completed.includes(gate.id);
  });

  if (skippedGate) {
    state.player.seekTo(Math.max(getGateTime(skippedGate) - 1, 0), true);
    openGate(skippedGate);
    return;
  }

  const reachedGate = lesson.checkpoints.find((gate) => {
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
  ensureYouTubePlayer();
  renderCheckpoints();
  renderStats();
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
    const isOpen = Boolean(state.openPlaylists[playlist.id]);

    return `
      <section class="playlist-group">
        <button class="playlist-toggle ${isOpen ? "open" : ""}" type="button" data-playlist-id="${playlist.id}" aria-expanded="${isOpen}">
          <span>${isOpen ? "−" : "+"}</span>
          <div>
            <strong>${escapeHTML(playlist.title)}</strong>
            <small>${lessons.length} ${lessons.length === 1 ? "lesson" : "lessons"}</small>
          </div>
        </button>
        <div class="playlist-lessons ${isOpen ? "open" : ""}">
          ${lessons.length > 0 ? lessons.map(({ lesson, index }, lessonIndex) => `
            <button class="lesson-item ${index === state.currentLessonIndex ? "active" : ""}" type="button" data-lesson-index="${index}">
              <span>${String(lessonIndex + 1).padStart(2, "0")}</span>
              <div>
                <strong>${escapeHTML(lesson.title)}</strong>
                <small>${escapeHTML(getLessonMeta(lesson))}</small>
              </div>
            </button>
          `).join("") : `
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

  els.lessonList.querySelectorAll(".lesson-item").forEach((button) => {
    button.addEventListener("click", () => switchLesson(Number(button.dataset.lessonIndex)));
  });
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
  els.intervalLabel.textContent = "Spread across video";
  els.checkpointList.innerHTML = lesson.checkpoints.map((gate) => {
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
  document.querySelector(".topbar .eyebrow").textContent = getPlaylistTitle(lesson.playlistId);
  els.progressLabel.textContent = `${completeCount} of ${total} gates`;
  els.progressMeter.style.width = `${percent}%`;
  els.completionBadge.textContent = percent === 100 ? "Completed" : "In progress";
  els.watchPosition.textContent = formatTime(progress.lastTime);
  els.scoreLabel.textContent = `${score}%`;
  els.attemptsLabel.textContent = String(progress.attempts);
  els.submissionsLabel.textContent = String(progress.submissions);
  els.nextGateLabel.textContent = nextGate ? `${nextGate.type === "quiz" ? "Quiz" : "Assignment"} at ${formatTime(getGateTime(nextGate))}` : "All gates done";
  els.assignmentStatusLabel.textContent = "Ready";
}

function renderLessonNotes() {
  const lesson = getCurrentLesson();
  els.notesBadge.textContent = lesson.assignmentTitle;
  els.notesList.innerHTML = lesson.notes.map((note) => `<li>${escapeHTML(note)}</li>`).join("");
}

function renderEmptyLessonState() {
  document.querySelector(".topbar h1").textContent = "No lessons posted yet";
  document.querySelector(".topbar .eyebrow").textContent = isTeacher() ? "Teacher Schedule" : "Student View";
  els.playerFallback.classList.remove("hidden");
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
    state.player.loadVideoById(lesson.videoId);
    if (progress.lastTime > 0) {
      state.player.seekTo(progress.lastTime, true);
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

function getRoleLabel() {
  return isTeacher() ? "Teacher" : "Student";
}

function openAssignment() {
  window.open(getLessonAssignmentUrl(getCurrentLesson()), "_blank", "noopener,noreferrer");
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

function signOut() {
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
  state.catalogLoaded = false;
  localStorage.removeItem("signedInUser");
  localStorage.removeItem("courseTopics");
  localStorage.removeItem("lessons");
  localStorage.removeItem("lessonCatalogVersion");
  localStorage.removeItem("lessonSchedule");
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
