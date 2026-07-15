const siteAuthConfig = {
  googleClientId: "1310085727-91rrgsf6ck7d03r2fqu7e2ro4orbc4kf.apps.googleusercontent.com",
  allowedEmails: {
    students: [
      "aishurao2021@gmail.com",
      "prasadc4de@gmail.com"
    ],
    teachers: [
      "prasadboyane@gmail.com"
    ]
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyCQNCEc4YyZDqJbK_V6QeFxj7LpiYBzO2Q",
  authDomain: "pbde-lms.firebaseapp.com",
  projectId: "pbde-lms",
  storageBucket: "pbde-lms.firebasestorage.app",
  messagingSenderId: "138158464844",
  appId: "1:138158464844:web:4cfb4ec494a447250b79e9",
  measurementId: "G-TGZPE43QMH"
};

const firebaseSchedulePath = {
  collection: "lms",
  document: "lessonSchedule"
};

const classroomTopics = [
  {
    id: "python",
    title: "Python",
    url: "https://classroom.google.com/w/ODMxNzMzNTA1MjY4/tc/ODIxMDA2NTA2OTY2"
  },
  {
    id: "sql",
    title: "SQL",
    url: "https://classroom.google.com/w/ODMxNzMzNTA1MjY4/tc/ODIxMDA2NDE1NTAz"
  },
  {
    id: "google-cloud",
    title: "Google Cloud",
    url: "https://classroom.google.com/w/ODMxNzMzNTA1MjY4/tc/ODIxMDA2MzY5MTMy"
  },
  {
    id: "placement-training",
    title: "Placement Training",
    url: "https://classroom.google.com/w/ODMxNzMzNTA1MjY4/tc/ODIxMDA2NDUzODQ2"
  },
];
const classroomAssignmentUrl = classroomTopics[0].url;
const lessonCatalogVersion = "2026-07-15-role-schedule-v7";

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
    focus: "Python Lecture 12",
    quizA: "How should you close out Lecture 12 practice?",
    answerA: "Submit solved work and questions",
    quizB: "Which routine helps check interview readiness?",
    answerB: "Daily mock interview session"
  }),
  {
    id: "data-marathon-python",
    playlistId: "python",
    title: "Data Marathon: Python",
    subtitle: "Marathon overview + hacking sheet",
    videoId: "jCDIYPMWWzA",
    intervalSeconds: 0,
    assignmentTitle: "Data Marathon: Python",
    assignmentUrl: classroomAssignmentUrl,
    notes: [
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
  },

  ...buildTopicLessons({
    playlistId: "sql",
    assignments: [
      { title: "Watch SQL Lecture 15", videos: ["zvJfCX9Nz58"] },
      { title: "Watch SQL Lecture 14", videos: ["1S8bNF3YuyY", "2IgZLPbbzvI"] },
      { title: "Watch SQL Lecture 13", videos: ["yiT9_upN7MQ", "BeWzrlnxsYA", "1pqLsqiGydg", "weHozvX77mg", "dp7Inof3AYU"] },
      {
        title: "Watch SQL Lecture 12",
        videos: ["n4wzLiEl7ns"],
        references: ["Reference sheet: https://docs.google.com/spreadsheets/d/138jK5qmlp920kWeVradQpWibDQV58L_183H_xJFONns/edit?usp=sharing"]
      },
      { title: "Watch SQL Lecture 11", videos: ["rA66H9QJsdc"] },
      {
        title: "Watch SQL Lecture 10",
        videos: ["Cw8WvKu9g4Y", "ngpsadW9Z8U", "ZLWt2ZttEqw"],
        references: ["Reference: https://learnsql.com/blog/sql-subquery-cte-difference/"]
      },
      { title: "Watch SQL Lecture 9", videos: ["WUYcfXH3oPM", "NXmtEqjpXWI"] },
      { title: "Watch SQL Lecture 8", videos: ["a5qXGAxeiTo"] },
      { title: "Watch SQL Lecture 7", videos: ["JjzxPyGc0_c"] }
    ]
  }),
  ...buildTopicLessons({
    playlistId: "google-cloud",
    assignments: [
      { title: "Watch Google Cloud Lecture 9", videos: ["NW0BhtOpsq0", "45f4EE-1mTE", "gzDsUtkrxMw"] },
      { title: "Weekly Session Revision", videos: ["SafqCmSNhdM"], tasks: ["Revise everything.", "Write queries in the QnA Sheet.", "Complete the daily mock interview session."] },
      { title: "Watch Google Cloud Lecture 8", videos: ["WmFfvQV-h8g"] },
      { title: "Watch Google Cloud Lecture 7", videos: ["ReuEJaS90zw"] },
      { title: "Watch Google Cloud Lecture 6", videos: ["jMsj2_cyGCw", "PqGqmzLYb8A", "4Wp_r8igV00"] },
      {
        title: "Watch Google Cloud Lecture 5",
        videos: ["02RN4G4xxMc"],
        references: ["Practice form: https://forms.gle/FMyD6myTAgka4U146"]
      },
      { title: "Watch Google Cloud Lecture 4", videos: ["m8v1aJICY9o"] },
      { title: "Watch Google Cloud Lecture 3", videos: ["XIPj3sLErq0"] },
      { title: "Watch Google Cloud Lecture 2", videos: ["oT-cNhLZOmE"] },
      {
        title: "Watch Google Cloud Lecture 1",
        videos: ["atc8r7ui4es"],
        references: ["Practice form: https://forms.gle/FMyD6myTAgka4U146"]
      }
    ]
  }),
  ...buildTopicLessons({
    playlistId: "placement-training",
    assignments: [
      {
        title: "Watch Placement Prep Lecture 7",
        videos: ["HXxa9YQJ2Lo", "TB5aj0wbo74", "APCm1VMIL6Y"],
        tasks: ["Record a 60 second introduction and upload it on YouTube.", "Solve video or assignment questions and submit in Classroom.", "Watch and record the HR call scripts.", "Complete the daily mock interview session."]
      },
      {
        title: "Watch Placement Prep Lecture 6",
        videos: ["wWKu5xtMisU", "YNBaXJ2mRjU", "VCrqZBcdPKY"],
        references: ["Practice form: https://forms.gle/Jxx6UFdEufbnRtW27"]
      },
      { title: "Watch Placement Prep Lecture 5", videos: ["-g1dPftuuWE", "LIXfbTGJisg"] },
      { title: "Watch Placement Prep Lecture 4", videos: ["pIM4Pszt9B4", "Lft_bS3iYHw", "Nc6SBJsuSAQ"] },
      {
        title: "Watch Placement Prep Lecture 3",
        videos: ["n5BttuJQp_A", "VolGD85_0Do"],
        references: ["Study document: https://docs.google.com/document/d/1FsOk1pokuGMHVkggc37oPR6xWTEiXU8Q01T7aNPrjFE/edit?usp=sharing"]
      },
      {
        title: "Watch Placement Prep Lecture 2",
        videos: ["mJHwRVAuhhc", "9SpVbXvth8g"],
        references: ["Naukri/profile document: https://docs.google.com/document/d/1n9Bq-8n9uiQ6YiDW-E2jTcfUp9SpzYLLFXLrjVYd4N0/edit?usp=sharing"],
        tasks: ["Make a video on your introduction and upload it on YouTube.", "Share Naukri profile screenshots and submit in Classroom.", "Write queries in the QnA Sheet.", "Complete the daily mock interview session."]
      },
      {
        title: "Watch Placement Prep Lecture 1",
        videos: ["_b0NCq01Vvw", "VCrqZBcdPKY"],
        references: [
          "Resume template: https://www.canva.com/templates/EAF0xAJK5wU-blue-and-white-professional-resume/",
          "Resume design: https://www.canva.com/design/DAGWJnn9c3k/RyUSm_lUXgy2qJcZGEU_0g/view?utm_content=DAGWJnn9c3k&utm_campaign=designshare&utm_medium=link&utm_source=editor",
          "Practice form: https://forms.gle/Jxx6UFdEufbnRtW27"
        ],
        tasks: ["Make a video on your introduction and upload it on YouTube.", "Prepare long and short intro scripts and upload them in Drive.", "Write queries in the QnA Sheet.", "Complete the daily mock interview session."]
      }
    ]
  })
];
const savedAuthConfig = readJSON("authConfig", {});
const authConfig = {
  googleClientId: siteAuthConfig.googleClientId || savedAuthConfig.googleClientId || "",
  allowedEmails: normalizeAllowedEmails(siteAuthConfig.allowedEmails || savedAuthConfig.allowedEmails || {})
};
const shouldResetLessonState = localStorage.getItem("lessonCatalogVersion") !== lessonCatalogVersion;

const state = {
  player: null,
  poller: null,
  firestore: null,
  firebaseAuth: null,
  firebaseReady: false,
  activeGate: null,
  currentLessonIndex: Number(localStorage.getItem("currentLessonIndex") || 0),
  user: readJSON("signedInUser", null),
  lessonState: shouldResetLessonState ? {} : readJSON("lessonState", {}),
  lessons: getStoredLessons(),
  openPlaylists: readJSON("openPlaylists", { python: true }),
  lessonSchedule: readJSON("lessonSchedule", {})
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

async function handleCredentialResponse(response) {
  const profile = decodeJwt(response.credential);
  if (!profile?.email || profile.email_verified === false) {
    showAuthError("Google did not return a verified Gmail account.");
    return;
  }

  const email = profile.email.toLowerCase();
  const role = getUserRole(email);
  if (!role) {
    showAuthError(`${profile.email} is not enrolled in this LMS.`);
    return;
  }

  state.user = {
    email: profile.email,
    name: profile.name || profile.email,
    picture: profile.picture || "",
    role
  };
  localStorage.setItem("signedInUser", JSON.stringify(state.user));
  await signInFirebase(response.credential);
  normalizeLessonIndex();
  renderAuthState();
  render();
  showToast(`Signed in as ${state.user.email}`);
}

function renderAuthState() {
  if (state.user?.email) {
    state.user.role = state.user.role || getUserRole(state.user.email);
    if (!state.user.role) {
      state.user = null;
      localStorage.removeItem("signedInUser");
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
  renderCheckpoints();
  renderStats();
  renderLessonNotes();
}

function renderLessonList() {
  els.lessonList.innerHTML = classroomTopics.map((playlist) => {
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
  return classroomTopics.find((playlist) => playlist.id === playlistId)?.title || "Private Video Series";
}

function getPlaylistUrl(playlistId) {
  return classroomTopics.find((playlist) => playlist.id === playlistId)?.url || classroomAssignmentUrl;
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
  document.querySelector(".topbar .eyebrow").textContent = getPlaylistTitle(lesson.playlistId);
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

function saveLessons() {
  localStorage.setItem("lessons", JSON.stringify(state.lessons));
  localStorage.setItem("lessonCatalogVersion", lessonCatalogVersion);
}

async function saveLessonSchedule() {
  localStorage.setItem("lessonSchedule", JSON.stringify(state.lessonSchedule));
  if (!state.firestore) return false;

  try {
    await withTimeout(
      state.firestore
        .collection(firebaseSchedulePath.collection)
        .doc(firebaseSchedulePath.document)
        .set({
          schedule: state.lessonSchedule,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }),
      5000
    );
    return true;
  } catch (error) {
    console.warn("Firebase schedule sync failed", error);
    return false;
  }
}

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Firebase sync timed out")), timeoutMs);
    })
  ]);
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
    state.firebaseReady = true;
    loadLessonScheduleFromCloud();
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
      .collection(firebaseSchedulePath.collection)
      .doc(firebaseSchedulePath.document)
      .get();
    const data = snapshot.exists ? snapshot.data() : null;
    if (data?.schedule && typeof data.schedule === "object") {
      state.lessonSchedule = data.schedule;
      localStorage.setItem("lessonSchedule", JSON.stringify(state.lessonSchedule));
      normalizeLessonIndex();
      render();
    }
    return true;
  } catch (error) {
    return false;
  }
}

async function signInFirebase(idToken) {
  if (!state.firebaseAuth || !idToken) return false;

  try {
    const credential = window.firebase.auth.GoogleAuthProvider.credential(idToken);
    await state.firebaseAuth.signInWithCredential(credential);
    await loadLessonScheduleFromCloud();
    return true;
  } catch (error) {
    showToast("Firebase sign-in failed. Schedule sync may be offline.");
    return false;
  }
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

function normalizeAllowedEmails(value) {
  if (Array.isArray(value)) {
    return {
      students: value.map((email) => email.toLowerCase()),
      teachers: []
    };
  }

  return {
    students: (value.students || []).map((email) => email.toLowerCase()),
    teachers: (value.teachers || []).map((email) => email.toLowerCase())
  };
}

function getUserRole(email) {
  const normalizedEmail = email.toLowerCase();
  if (authConfig.allowedEmails.teachers.includes(normalizedEmail)) return "teacher";
  if (authConfig.allowedEmails.students.includes(normalizedEmail)) return "student";
  return "";
}

function isTeacher() {
  return state.user?.role === "teacher";
}

function getRoleLabel() {
  return isTeacher() ? "Teacher" : "Student";
}

function buildTopicLessons(config) {
  const playlist = classroomTopics.find((item) => item.id === config.playlistId);
  return config.assignments.flatMap((assignment) => {
    return assignment.videos.map((videoId, index) => {
      const hasParts = assignment.videos.length > 1;
      const lessonTitle = hasParts ? `${assignment.title}: Part ${index + 1}` : assignment.title;
      const cleanId = `${config.playlistId}-${assignment.title}-${index + 1}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const notes = [
        `Video: https://youtu.be/${videoId}`,
        ...(assignment.references || []),
        ...(assignment.tasks || taskNotes)
      ];

      return buildLesson({
        id: cleanId,
        playlistId: config.playlistId,
        title: lessonTitle,
        videoId,
        focus: assignment.title,
        assignmentTitle: assignment.title,
        assignmentUrl: playlist.url,
        notes,
        quizA: `What should you focus on while watching ${assignment.title}?`,
        answerA: "Understand the concept and practice it yourself",
        quizB: `Where should work for ${assignment.title} be completed or submitted?`,
        answerB: "Google Classroom"
      });
    });
  });
}

function buildLesson(config) {
  const assignmentTitle = config.assignmentTitle || config.title;
  const playlistId = config.playlistId || "python";
  return {
    id: config.id,
    playlistId,
    title: config.title,
    subtitle: `${config.focus} + Classroom assignment`,
    videoId: config.videoId,
    intervalSeconds: 0,
    assignmentTitle,
    assignmentUrl: config.assignmentUrl || getPlaylistUrl(playlistId),
    notes: config.notes || [
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

  const synced = await saveLessonSchedule();
  showToast(synced ? "Schedule synced to Firebase." : "Schedule saved locally. Firebase sync needs Auth/rules check.");
}

async function clearScheduleFromModal() {
  const lessonId = els.scheduleLessonSelect.value;
  delete state.lessonSchedule[lessonId];
  localStorage.setItem("lessonSchedule", JSON.stringify(state.lessonSchedule));
  normalizeLessonIndex();
  render();
  els.scheduleModal.close();
  showToast("Lesson hidden. Syncing...");

  const synced = await saveLessonSchedule();
  showToast(synced ? "Schedule synced to Firebase." : "Schedule saved locally. Firebase sync needs Auth/rules check.");
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
  if (state.user?.email && !state.user.role) {
    state.user.role = getUserRole(state.user.email);
  }

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
