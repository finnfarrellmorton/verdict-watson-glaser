const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const STORAGE_KEY = 'verdict-critical-platform-v1';
const now = () => Date.now();

const domains = [
  {
    id: 'inference',
    name: 'Inference',
    family: 'Drawing inferences',
    short: 'Judge whether a statement is true, probably true, unsupported, probably false or false.',
    lesson: 'Inference questions reward restraint. Treat direct statements as true, cautious extensions as probably true, and anything beyond the evidence as insufficient data. Do not import real-world knowledge.',
    traps: ['Turning a trend into a guarantee', 'Treating plausible background knowledge as evidence', 'Missing the difference between probably false and false']
  },
  {
    id: 'assumptions',
    name: 'Assumptions',
    family: 'Recognising assumptions',
    short: 'Find what must be accepted for an argument to work.',
    lesson: 'An assumption is not just something mentioned in the argument. It is a hidden bridge between the evidence and the conclusion. Negate the option: if the argument collapses, it is likely assumed.',
    traps: ['Choosing a broad claim the argument does not need', 'Confusing a conclusion with an assumption', 'Selecting a true-sounding but unnecessary statement']
  },
  {
    id: 'deduction',
    name: 'Deduction',
    family: 'Deduction',
    short: 'Decide whether a conclusion follows necessarily from stated premises.',
    lesson: 'Deduction is stricter than ordinary judgement. A conclusion can be reasonable and still not follow. Only mark it correct if the premises force it.',
    traps: ['Reversing all/some rules', 'Accepting likely conclusions', 'Assuming causal relationships that were not stated']
  },
  {
    id: 'interpretation',
    name: 'Interpretation',
    family: 'Interpretation',
    short: 'Choose the conclusion best supported by a passage.',
    lesson: 'Interpretation asks for the most justified reading of the evidence. Strong answers stay close to the passage, include limitations, and avoid universal claims.',
    traps: ['Ignoring stated limitations', 'Rejecting useful evidence because it is imperfect', 'Choosing dramatic conclusions over supported ones']
  },
  {
    id: 'arguments',
    name: 'Arguments',
    family: 'Evaluating arguments',
    short: 'Separate strong, relevant arguments from weak or emotional ones.',
    lesson: 'A strong argument is relevant to the exact question, practical, evidence-based and proportionate. Popularity, anecdotes and personal preference are usually weak.',
    traps: ['Rewarding confident language', 'Choosing anecdotes', 'Missing whether the argument answers the actual question']
  }
];

const titleMap = {
  dashboard: ['HOME', 'Commercial awareness and critical thinking, in one place.'],
  learn: ['LEARN', 'Pick a domain to understand.'],
  practice: ['PRACTICE', 'Set up a short drill.'],
  firmData: ['FIRM DATA', 'Search firms and compare rankings.'],
  assessment: ['MOCK', 'Answer each question.'],
  results: ['RESULTS', 'See what to improve next.'],
  review: ['REVIEW', 'Revisit missed questions.'],
  progress: ['ANALYTICS', 'Percentage correct by domain.'],
  plan: ['PLAN', 'Simple study plan.'],
  pricing: ['PRICING', 'Choose the access level your preparation needs.'],
  admin: ['ADMIN', 'Manage platform content.'],
  account: ['PROFILE', 'Manage profile, access and preferences.']
};

const defaultState = {
  role: 'student',
  profile: {
    name: '',
    email: '',
    sector: 'Law',
    plan: 'free',
    dailyTarget: 10,
    emailConsent: false,
    onboardingCompleted: false
  },
  attempts: [],
  reviewItems: [],
  bookmarks: [],
  auditLogs: [
    { at: now() - 86400000, actor: 'system', action: 'Seed question bank loaded for development review.' },
    { at: now() - 3600000, actor: 'content-reviewer', action: 'Reviewed generated question families for original wording.' }
  ],
  currentSession: null
};

let state = loadState();
let timerHandle = null;

function loadState() {
  try {
    return { ...structuredClone(defaultState), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function domainByFamily(family) {
  return domains.find(domain => domain.family === family) || domains[0];
}

function allQuestions() {
  if (!window.getVerdictQuestions) return [];
  return window.getVerdictQuestions('mixed').map((question, index) => ({
    ...question,
    domainId: domainByFamily(question.family).id,
    difficulty: ['foundational', 'standard', 'advanced'][index % 3],
    tags: [domainByFamily(question.family).id, question.id.slice(0, 3), index % 2 ? 'commercial-context' : 'recruitment-context'],
    status: index % 97 === 0 ? 'in_review' : 'published',
    version: 1
  }));
}

function safeQuestion(question) {
  const { answer, explanation, ...visible } = question;
  return visible;
}

function getResponses() {
  return state.attempts.flatMap(attempt => attempt.responses.map(response => ({ ...response, attemptId: attempt.id, submittedAt: attempt.submittedAt })));
}

function responseFor(questionId) {
  return getResponses().filter(response => response.questionId === questionId);
}

function computeMetrics() {
  const responses = getResponses();
  const correct = responses.filter(response => response.correct).length;
  const accuracy = responses.length ? Math.round((correct / responses.length) * 100) : 0;
  const due = state.reviewItems.filter(item => item.reviewState !== 'cleared' && item.dueAt <= now()).length;
  const byDomain = domains.map(domain => {
    const domainResponses = responses.filter(response => response.domainId === domain.id);
    const domainCorrect = domainResponses.filter(response => response.correct).length;
    const accuracy = domainResponses.length ? Math.round((domainCorrect / domainResponses.length) * 100) : 0;
    const avgTime = domainResponses.length ? Math.round(domainResponses.reduce((sum, response) => sum + response.timeSeconds, 0) / domainResponses.length) : 0;
    const mastery = masteryScore(domainResponses, accuracy);
    return { ...domain, attempted: domainResponses.length, correct: domainCorrect, accuracy, avgTime, mastery, label: masteryLabel(mastery, domainResponses.length) };
  });
  return { responses, correct, accuracy, due, byDomain };
}

function masteryScore(responses, accuracy) {
  if (!responses.length) return 0;
  const sampleFactor = Math.min(1, responses.length / 30);
  const confidencePenalty = 0;
  const timingPenalty = responses.filter(response => response.timeSeconds > 90).length;
  return Math.max(0, Math.min(100, Math.round((accuracy * sampleFactor) - confidencePenalty - timingPenalty)));
}

function masteryLabel(score, sampleSize) {
  if (sampleSize < 10) return 'Needs sample';
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Developing';
  return 'Priority';
}

function seededShuffle(items, seed) {
  const copy = [...items];
  let value = seed || 98123;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    value = (value * 9301 + 49297) % 233280;
    const swapIndex = Math.floor((value / 233280) * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function selectQuestions({ mode = 'adaptive', domainId = 'all', limit = 10, difficulty = 'all' } = {}) {
  const bank = allQuestions().filter(question => question.status === 'published');
  const answeredCounts = new Map(getResponses().map(response => [response.questionId, response]));
  const dueIds = new Set(state.reviewItems.filter(item => item.reviewState !== 'cleared' && item.dueAt <= now()).map(item => item.questionId));
  const weakDomain = [...computeMetrics().byDomain].sort((a, b) => a.mastery - b.mastery)[0]?.id || 'inference';

  let candidates = bank;
  if (mode === 'domain' && domainId !== 'all') candidates = candidates.filter(question => question.domainId === domainId);
  if (mode === 'review') candidates = candidates.filter(question => dueIds.has(question.id));
  if (mode === 'adaptive') candidates = candidates.filter(question => question.domainId === weakDomain || dueIds.has(question.id) || !answeredCounts.has(question.id));
  if (difficulty !== 'all') candidates = candidates.filter(question => question.difficulty === difficulty);
  if (!candidates.length) candidates = bank.filter(question => domainId === 'all' || question.domainId === domainId);

  return seededShuffle(candidates, now() % 100000)
    .sort((a, b) => Number(dueIds.has(b.id)) - Number(dueIds.has(a.id)) || Number(answeredCounts.has(a.id)) - Number(answeredCounts.has(b.id)))
    .slice(0, limit);
}

function startSession({ type = 'practice', mode = 'adaptive', domainId = 'all', limit = 10, difficulty = 'all', feedbackMode = 'immediate', mock = 'none', questionIds = null } = {}) {
  const bankById = new Map(allQuestions().map(question => [question.id, question]));
  const questions = Array.isArray(questionIds)
    ? questionIds.map(id => bankById.get(id)).filter(Boolean).slice(0, limit)
    : mock === 'full'
    ? selectQuestions({ mode: 'mixed', domainId: 'all', limit: 40, difficulty: 'all' })
    : mock === 'mini'
      ? selectQuestions({ mode: 'mixed', domainId: 'all', limit: 12, difficulty: 'all' })
      : selectQuestions({ mode, domainId, limit, difficulty });

  state.currentSession = {
    id: crypto.randomUUID(),
    type,
    mock,
    mode,
    feedbackMode: mock === 'none' ? feedbackMode : 'end',
    startedAt: now(),
    expiresAt: mock === 'full' ? now() + 35 * 60 * 1000 : mock === 'mini' ? now() + 12 * 60 * 1000 : null,
    currentIndex: 0,
    questions: questions.map(question => question.id),
    responses: {}
  };
  saveState();
  setView('assessment');
  renderAssessment();
  showToast(`${mock === 'none' ? 'Practice drill' : mock === 'full' ? 'Full mock' : 'Mini mock'} started.`);
}

function getCurrentQuestions() {
  const bank = new Map(allQuestions().map(question => [question.id, question]));
  return (state.currentSession?.questions || []).map(id => bank.get(id)).filter(Boolean);
}

function renderAssessment() {
  const session = state.currentSession;
  const questions = getCurrentQuestions();
  const active = Boolean(session && questions.length);
  $('#assessmentIntro').classList.toggle('hidden', active);
  $('#assessmentStage').classList.toggle('hidden', !active);
  if (!active) return;

  const index = Math.min(session.currentIndex, questions.length - 1);
  const question = questions[index];
  const saved = session.responses[question.id] || {};
  const answeredCount = Object.values(session.responses).filter(response => Number.isInteger(response.selected)).length;
  const reveal = false;
  const correct = Number.isInteger(saved.selected) && saved.selected === question.answer;

  $('#assessmentModeLabel').textContent = session.mock === 'none' ? 'PRACTICE DRILL' : `${session.mock.toUpperCase()} MOCK`;
  $('#assessmentTitle').textContent = `${questions.length} questions · ${session.mode}`;
  $('#questionFamily').textContent = question.family;
  $('#questionNumber').textContent = `Question ${index + 1} of ${questions.length}`;
  $('#questionPrompt').textContent = safeQuestion(question).prompt;
  $('#autosaveIndicator').textContent = Number.isInteger(saved.selected) ? 'Answer saved locally' : 'Ready to save';
  $('#confidenceSelect').value = saved.confidence || 2;
  $('#flagQuestion').checked = Boolean(saved.flagged);
  $('#checkAnswer').textContent = 'Save answer';
  $('#feedback').innerHTML = reveal ? `<strong>${correct ? 'Correct.' : 'Not quite.'}</strong> ${question.explanation}` : '';
  $('#progressFill').style.width = `${Math.round((answeredCount / questions.length) * 100)}%`;

  $('#answerOptions').innerHTML = question.options.map((option, optionIndex) => {
    const selected = saved.selected === optionIndex ? 'selected' : '';
    const correctClass = reveal && optionIndex === question.answer ? 'correct' : '';
    const wrongClass = reveal && saved.selected === optionIndex && !correct ? 'wrong' : '';
    return `<button class="option ${selected} ${correctClass} ${wrongClass}" data-option="${optionIndex}"><span>${String.fromCharCode(65 + optionIndex)}</span>${option}</button>`;
  }).join('');

  $$('.option').forEach(button => {
    button.onclick = () => answerAndAdvance(question, Number(button.dataset.option));
  });

  $('#navigatorGrid').innerHTML = questions.map((item, itemIndex) => {
    const response = session.responses[item.id];
    const classes = [itemIndex === index ? 'active' : '', Number.isInteger(response?.selected) ? 'answered' : '', response?.flagged ? 'flagged' : ''].join(' ');
    return `<button class="${classes}" data-jump="${itemIndex}" aria-label="Question ${itemIndex + 1}">${itemIndex + 1}</button>`;
  }).join('');
  $$('[data-jump]').forEach(button => {
    button.onclick = () => {
      session.currentIndex = Number(button.dataset.jump);
      saveState();
      renderAssessment();
    };
  });
  renderTimer();
}

function saveResponse(question, selected, explicitCheck) {
  const session = state.currentSession;
  if (!session) return;
  const started = session.startedAt || now();
  session.responses[question.id] = {
    questionId: question.id,
    domainId: question.domainId,
    family: question.family,
    selected,
    confidence: 2,
    flagged: $('#flagQuestion').checked,
    correct: selected === question.answer,
    timeSeconds: Math.max(1, Math.round((now() - started) / 1000 / Math.max(1, Object.keys(session.responses).length + 1))),
    answeredAt: now()
  };
  if (session.mode === 'review' && selected === question.answer) {
    clearReviewItem(question.id);
  }
  saveState();
  renderAssessment();
  if (explicitCheck) showToast('Answer saved.');
}

function clearReviewItem(questionId) {
  const item = state.reviewItems.find(item => item.questionId === questionId);
  if (!item) return;
  item.reviewState = 'cleared';
  item.lastReviewedAt = now();
  item.reviewCount += 1;
}

function answerAndAdvance(question, selected) {
  saveResponse(question, selected, false);
  const session = state.currentSession;
  if (!session) return;

  const questions = getCurrentQuestions();
  const answeredCount = questions.filter(item => Number.isInteger(session.responses[item.id]?.selected)).length;
  if (answeredCount >= questions.length) {
    setTimeout(submitAttempt, 220);
    return;
  }

  const nextUnanswered = questions.findIndex((item, index) => index > session.currentIndex && !Number.isInteger(session.responses[item.id]?.selected));
  session.currentIndex = nextUnanswered >= 0
    ? nextUnanswered
    : questions.findIndex(item => !Number.isInteger(session.responses[item.id]?.selected));
  saveState();
  setTimeout(renderAssessment, 160);
}

function renderTimer() {
  const session = state.currentSession;
  if (!session?.expiresAt) {
    $('#timerText').textContent = formatTime(Math.round((now() - session.startedAt) / 1000));
    return;
  }
  const remaining = Math.max(0, Math.round((session.expiresAt - now()) / 1000));
  $('#timerText').textContent = formatTime(remaining);
  if (remaining === 0) submitAttempt();
}

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

function submitAttempt() {
  const session = state.currentSession;
  if (!session) return;
  const questions = getCurrentQuestions();
  const responses = questions.map(question => {
    const response = session.responses[question.id] || {};
    return {
      questionId: question.id,
      domainId: question.domainId,
      family: question.family,
      promptSnapshot: question.prompt,
      optionsSnapshot: question.options,
      correctAnswer: question.answer,
      explanationSnapshot: question.explanation,
      selected: Number.isInteger(response.selected) ? response.selected : null,
      confidence: 2,
      flagged: Boolean(response.flagged),
      correct: Number.isInteger(response.selected) && response.selected === question.answer,
      timeSeconds: response.timeSeconds || Math.round((now() - session.startedAt) / 1000 / Math.max(1, questions.length))
    };
  });

  const correct = responses.filter(response => response.correct).length;
  const attempt = {
    id: session.id,
    type: session.mock === 'none' ? session.mode : `${session.mock} mock`,
    startedAt: session.startedAt,
    submittedAt: now(),
    durationSeconds: Math.round((now() - session.startedAt) / 1000),
    totalQuestions: responses.length,
    answeredQuestions: responses.filter(response => response.selected !== null).length,
    correctAnswers: correct,
    accuracy: responses.length ? Math.round((correct / responses.length) * 100) : 0,
    responses
  };

  state.attempts.unshift(attempt);
  updateReviewQueue(attempt);
  state.currentSession = null;
  saveState();
  syncAttemptToSupabase(attempt);
  setView('results');
  renderAll();
  showToast('Finished. Results are ready.');
}

async function syncAttemptToSupabase(attempt) {
  const token = localStorage.getItem('verdict-supabase-access-token');
  if (!token) return;
  try {
    const breakdown = Object.fromEntries(domains.map(domain => {
      const responses = attempt.responses.filter(response => response.domainId === domain.id);
      const correct = responses.filter(response => response.correct).length;
      return [domain.id, {
        attempted: responses.length,
        correct,
        accuracy: responses.length ? Math.round((correct / responses.length) * 100) : 0
      }];
    }));
    const response = await fetch('/api/record-attempt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionType: attempt.type,
        totalQuestions: attempt.totalQuestions,
        answeredQuestions: attempt.answeredQuestions,
        correctAnswers: attempt.correctAnswers,
        accuracy: attempt.accuracy,
        durationSeconds: attempt.durationSeconds,
        breakdown
      })
    });
    if (!response.ok) throw new Error('Attempt sync failed');
    showToast('Saved to Supabase.');
  } catch {
    showToast('Saved locally. Supabase sync needs a valid login token.');
  }
}

function updateReviewQueue(attempt) {
  const existing = new Map(state.reviewItems.map(item => [item.questionId, item]));
  attempt.responses.forEach(response => {
    if (response.correct && existing.has(response.questionId)) {
      const item = existing.get(response.questionId);
      item.reviewState = 'cleared';
      item.lastReviewedAt = now();
      item.reviewCount += 1;
      existing.set(response.questionId, item);
      return;
    }
    const needsReview = !response.correct || response.flagged;
    if (!needsReview) return;
    const previous = existing.get(response.questionId);
    const history = previous?.reviewCount || 0;
    existing.set(response.questionId, {
      id: previous?.id || crypto.randomUUID(),
      questionId: response.questionId,
      domainId: response.domainId,
      family: response.family,
      reason: response.flagged ? 'Flagged for review' : 'Incorrect answer',
      reviewState: 'due',
      reviewCount: history,
      flagged: response.flagged,
      timeSeconds: response.timeSeconds,
      lastReviewedAt: previous?.lastReviewedAt || null,
      dueAt: now()
    });
  });
  state.reviewItems = [...existing.values()];
}

function setView(view) {
  const resolved = titleMap[view] ? view : 'dashboard';
  $$('.view').forEach(node => node.classList.toggle('active', node.id === `${resolved}View`));
  $$('.nav-item').forEach(node => node.classList.toggle('active', node.dataset.view === resolved));
  $('#eyebrow').textContent = titleMap[resolved][0];
  $('#viewTitle').textContent = titleMap[resolved][1];
  if (resolved === 'dashboard') renderDashboard();
  if (resolved === 'practice') renderPractice();
  if (resolved === 'assessment') renderAssessment();
  if (resolved === 'review') renderReview();
  if (resolved === 'progress') renderProgress();
  if (resolved === 'firmData') renderFirmData();
  if (resolved === 'admin') renderAdmin();
  if (resolved === 'results') renderResults();
  scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDashboard() {
  const metrics = computeMetrics();
  const hasActiveSession = Boolean(state.currentSession);
  const weekly = weeklyTargetProgress();
  $('#sidebarName').textContent = state.profile.name || 'Guest student';
  $('#sidebarPlan').textContent = planName(state.profile.plan);
  $('#dashboardWelcome').textContent = state.profile.name
    ? `${state.profile.name}, your next best practice action.`
    : 'Your next best practice action.';
  $('#statCompleted').textContent = metrics.responses.length.toLocaleString();
  $('#statAccuracy').textContent = `${metrics.accuracy}%`;
  $('#statDue').textContent = metrics.due;
  $('#statStreak').textContent = `${calculateStreak()} days`;
  $('#targetCopy').textContent = `${todayQuestionCount()} / ${state.profile.dailyTarget} daily target`;
  $('#weeklyTargetValue').textContent = `${weekly.completed}/${weekly.target}`;
  $('#weeklyTargetCopy').textContent = `${weekly.percent}% of this week’s target complete.`;
  $('#weeklyTargetFill').style.width = `${weekly.percent}%`;
  const weak = metrics.byDomain.sort((a, b) => a.mastery - b.mastery)[0];
  $('#nextActionTitle').textContent = metrics.due ? 'Review due mistakes before starting new questions.' : `Train ${weak.name.toLowerCase()} next.`;
  $('#nextActionCopy').textContent = metrics.due
    ? `${metrics.due} item${metrics.due === 1 ? '' : 's'} are ready for spaced review.`
    : weak.attempted ? `${weak.name} is your lowest domain.` : 'Start with any domain or a diagnostic.';
  $('#dashboardNextCopy').textContent = $('#nextActionCopy').textContent;
  const recommendedAction = () => metrics.due ? startSession({ mode: 'review', limit: Math.min(10, metrics.due) }) : startSession({ mode: weak.attempted ? 'domain' : 'mixed', domainId: weak.attempted ? weak.id : 'all', limit: 10 });
  $('#nextActionButton').onclick = recommendedAction;
  $('#dashboardPrimaryAction').onclick = recommendedAction;
  $('#continueSessionButton').hidden = !hasActiveSession;
  $('#continueSessionButton').onclick = () => setView('assessment');

  $('#dashboardDomains').innerHTML = metrics.byDomain.map(domain => domainCard(domain)).join('');
  $$('.domain-card').forEach(card => {
    card.onclick = () => startSession({ mode: 'domain', domainId: card.dataset.domain, limit: 10, feedbackMode: 'end' });
    card.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    };
  });

  $('#recentActivity').innerHTML = state.attempts.length ? state.attempts.slice(0, 6).map(attempt => `
    <div><span>${attempt.type}</span><strong>${attempt.accuracy}%</strong><small>${new Date(attempt.submittedAt).toLocaleDateString()}</small></div>
  `).join('') : '<p class="empty">No submitted attempts yet.</p>';

  $('#mistakeThemes').innerHTML = metrics.byDomain
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3)
    .map(domain => `<div><strong>${domain.name}</strong><span>${domain.attempted ? `${domain.accuracy}% accuracy · ${domain.label}` : 'No data yet'}</span></div>`)
    .join('');

  renderLandingFirmPreview();
}

function renderLandingFirmPreview() {
  if (!$('#landingFirmPreview')) return;
  $('#landingFirmPreview').innerHTML = firms()
    .slice()
    .sort((a, b) => b.traineeSeats - a.traineeSeats)
    .slice(0, 6)
    .map((firm, index) => `
      <button class="firm-ranking-row" data-landing-firm="${firm.slug}">
        <span class="rank-number">${index + 1}</span>
        <span class="firm-row-main">
          <strong>${firm.name}</strong>
          <small>${firm.traineeSeats} seats · ${firm.tag}</small>
        </span>
        <span class="firm-row-score">${firm.traineeSeats}</span>
      </button>
    `).join('');
  $$('[data-landing-firm]').forEach(button => {
    button.onclick = () => {
      window.location.href = `firm.html?firm=${encodeURIComponent(button.dataset.landingFirm)}`;
    };
  });
}

function domainCard(domain) {
  return `
    <article class="domain-card" data-domain="${domain.id}" role="button" tabindex="0">
      <div><span>${domain.name}</span><strong>${domain.attempted ? `${domain.accuracy}%` : '-'}</strong></div>
      <p>${domain.short}</p>
      <div class="bar"><i style="width:${domain.attempted ? domain.accuracy : 0}%"></i></div>
      <small>${domain.attempted} attempted · ${domain.mastery}% mastery · ${domain.label}</small>
    </article>
  `;
}

function readinessScore(metrics) {
  if (!metrics.responses.length) return 0;
  return Math.round(metrics.byDomain.reduce((sum, domain) => sum + domain.mastery, 0) / domains.length);
}

function todayQuestionCount() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return getResponses().filter(response => response.submittedAt >= start.getTime()).length;
}

function weeklyTargetProgress() {
  const day = new Date();
  const dayOfWeek = day.getDay() || 7;
  const monday = new Date(day);
  monday.setDate(day.getDate() - dayOfWeek + 1);
  monday.setHours(0, 0, 0, 0);
  const completed = getResponses().filter(response => response.submittedAt >= monday.getTime()).length;
  const target = Math.max(1, Number(state.profile.dailyTarget || 10) * 7);
  return { completed, target, percent: Math.min(100, Math.round((completed / target) * 100)) };
}

function calculateStreak() {
  const days = new Set(getResponses().map(response => new Date(response.submittedAt).toDateString()));
  let streak = 0;
  const day = new Date();
  while (days.has(day.toDateString())) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}

function planName(plan) {
  return ({ free: 'Free preview', daily: 'Daily Practice', pro: 'Pro', institution: 'Institution' })[plan] || 'Free preview';
}

function renderLessons() {
  $('#lessonGrid').innerHTML = domains.map(domain => `
    <article class="lesson-card" data-lesson="${domain.id}">
      <span>${domain.family}</span>
      <h3>${domain.name}</h3>
      <p>${domain.short}</p>
      <button class="secondary">Open lesson</button>
    </article>
  `).join('');
  $$('.lesson-card').forEach(card => card.onclick = () => renderLessonDetail(card.dataset.lesson));
  renderLessonDetail(domains[0].id);
}

function renderLessonDetail(domainId) {
  const domain = domains.find(item => item.id === domainId) || domains[0];
  $('#lessonDetail').innerHTML = `
    <p class="eyebrow">${domain.family}</p>
    <h3>${domain.name}</h3>
    <p>${domain.lesson}</p>
    <h4>Common traps</h4>
    <ul>${domain.traps.map(trap => `<li>${trap}</li>`).join('')}</ul>
    <div class="lesson-actions">
      <button class="primary" data-start-domain="${domain.id}">Start ${domain.name.toLowerCase()} drill</button>
    </div>
  `;
  $('[data-start-domain]').onclick = () => startSession({ mode: 'domain', domainId, limit: 10 });
}

function renderPractice() {
  $('#domainSelect').innerHTML = '<option value="all">All domains</option>' + domains.map(domain => `<option value="${domain.id}">${domain.name}</option>`).join('');
  $('#practiceDomains').innerHTML = computeMetrics().byDomain.map(domain => domainCard(domain)).join('');
  $$('#practiceDomains .domain-card').forEach(card => {
    card.onclick = () => startSession({ mode: 'domain', domainId: card.dataset.domain, limit: 10, feedbackMode: 'end' });
    card.onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        card.click();
      }
    };
  });
  const sessions = [
    ['adaptive', 'Adaptive drill', 'Prioritises weak domains, due items and unseen questions.'],
    ['domain', 'Single-domain drill', 'Focus one Watson-Glaser-style family.'],
    ['mixed', 'Mixed practice', 'Balanced practice across all five domains.'],
    ['review', 'Due-review practice', 'Revisit mistakes and flagged questions.']
  ];
  $('#sessionGrid').innerHTML = sessions.map(session => `
    <article class="session-card" data-session-mode="${session[0]}">
      <div class="session-top"><span>${session[0]}</span><strong>Deterministic</strong></div>
      <h3>${session[1]}</h3>
      <p>${session[2]}</p>
      <footer><span>Original bank</span><span>Saved results</span></footer>
    </article>
  `).join('');
  $$('[data-session-mode]').forEach(card => {
    card.onclick = () => {
      $('#practiceMode').value = card.dataset.sessionMode;
      $('#startPractice').click();
    };
  });
}

const firmCriteriaLabels = {
  traineeSeats: 'Training contract seats',
  prestige: 'Student interest',
  pay: 'Pay',
  training: 'Training',
  work: 'Work quality',
  balance: 'Work/life balance',
  international: 'International exposure',
  offices: 'Office footprint'
};

function firms() {
  return window.LAW_FIRMS || [];
}

function renderFirmData() {
  if (!$('#firmRankingList')) return;
  const criterion = $('#firmCriterion')?.value || 'traineeSeats';
  const term = ($('#firmSearch')?.value || '').toLowerCase().trim();
  const rows = firms()
    .filter(firm => !term || `${firm.name} ${firm.tag} ${firm.note} ${(firm.seats || []).join(' ')} ${(firm.universities || []).join(' ')}`.toLowerCase().includes(term))
    .sort((a, b) => (b[criterion] || 0) - (a[criterion] || 0));

  $('#firmLeaderboardTitle').textContent = firmCriteriaLabels[criterion] || 'Leaderboard';
  $('#firmResultCount').textContent = `${rows.length} firm${rows.length === 1 ? '' : 's'}`;
  $('#firmRankingList').innerHTML = rows.map((firm, index) => `
    <button class="firm-ranking-row" data-firm="${firm.slug}">
      <span class="rank-number">${index + 1}</span>
      <span class="firm-row-main">
        <strong>${firm.name}</strong>
        <small>${firm.tag} · ${firm.traineeSeats} seats · ${firm.offices} offices</small>
      </span>
      <span class="firm-row-score">${firm[criterion] || 0}</span>
    </button>
  `).join('');

  $$('.firm-ranking-row').forEach(button => {
    button.onclick = () => {
      window.location.href = `firm.html?firm=${encodeURIComponent(button.dataset.firm)}`;
    };
  });
  renderFirmDetail(rows[0]?.slug);
}

function renderFirmDetail(slug) {
  const firm = firms().find(item => item.slug === slug) || firms()[0];
  if (!firm) {
    $('#firmDetailPanel').innerHTML = '<p class="empty">No firm selected.</p>';
    return;
  }
  $('#firmDetailPanel').innerHTML = `
    <p class="eyebrow">${firm.tag}</p>
    <h3>${firm.name}</h3>
    <p>${firm.note}</p>
    <section class="firm-mini-stats">
      <div><span>Seats</span><strong>${firm.traineeSeats}</strong></div>
      <div><span>Offices</span><strong>${firm.offices}</strong></div>
      <div><span>Pay</span><strong>${firm.pay}/100</strong></div>
      <div><span>Training</span><strong>${firm.training}/100</strong></div>
    </section>
    <h4>Practice strengths</h4>
    <p>${(firm.seats || []).slice(0, 8).join(', ')}</p>
    <h4>Application fit</h4>
    <p>${(firm.bestFor || []).slice(0, 4).join(' · ') || 'Compare intake, practice areas and training style before applying.'}</p>
    <a class="primary full" href="firm.html?firm=${encodeURIComponent(firm.slug)}">Open full firm profile</a>
  `;
}

function renderResults() {
  const attempt = state.attempts[0];
  if (!attempt) {
    $('#resultsStats').innerHTML = '';
    $('#resultsBreakdown').innerHTML = '';
    $('#resultsAnalysis').innerHTML = '<p class="empty">Submit an attempt to generate real feedback.</p>';
    $('#questionReview').innerHTML = '';
    return;
  }

  $('#resultsTitle').textContent = `${attempt.accuracy}% on ${attempt.type}`;
  $('#resultsCopy').textContent = `${attempt.correctAnswers} correct from ${attempt.totalQuestions}. ${attempt.answeredQuestions} answered. Duration: ${formatTime(attempt.durationSeconds)}.`;
  const unanswered = attempt.totalQuestions - attempt.answeredQuestions;
  const previousComparable = state.attempts.find(candidate => candidate.id !== attempt.id && candidate.type === attempt.type);
  const averageResponseTime = attempt.responses.length
    ? Math.round(attempt.responses.reduce((sum, response) => sum + response.timeSeconds, 0) / attempt.responses.length)
    : 0;
  $('#resultsStats').innerHTML = [
    ['Score', `${attempt.correctAnswers}/${attempt.totalQuestions}`, 'Deterministic scoring'],
    ['Accuracy', `${attempt.accuracy}%`, 'Submitted answers only'],
    ['Incorrect', attempt.responses.filter(response => !response.correct).length, 'Saved for review'],
    ['Unanswered', unanswered, 'No answer selected'],
    ['Time used', formatTime(attempt.durationSeconds), 'Session duration'],
    ['Avg response', `${averageResponseTime}s`, 'Per question'],
    ['Previous', previousComparable ? `${previousComparable.accuracy}%` : '-', previousComparable ? `${attempt.accuracy - previousComparable.accuracy >= 0 ? '+' : ''}${attempt.accuracy - previousComparable.accuracy} pts` : 'No comparable attempt'],
    ['Flagged', attempt.responses.filter(response => response.flagged).length, 'Added to review queue']
  ].map(item => `<article><small>${item[0]}</small><strong>${item[1]}</strong><span>${item[2]}</span></article>`).join('');

  const breakdown = domains.map(domain => {
    const responses = attempt.responses.filter(response => response.domainId === domain.id);
    const accuracy = responses.length ? Math.round((responses.filter(response => response.correct).length / responses.length) * 100) : 0;
    return { ...domain, attempted: responses.length, accuracy };
  });
  $('#resultsBreakdown').innerHTML = breakdown.map(domain => analyticsRow(domain.name, domain.accuracy, `${domain.attempted} questions`)).join('');

  const weakest = breakdown.sort((a, b) => a.accuracy - b.accuracy)[0];
  $('#resultsAnalysis').innerHTML = `
    <p>Your lowest domain in this attempt was <strong>${weakest.name}</strong>. Review explanations before attempting another timed mock.</p>
    <p>Wrong answers have been added to Review automatically.</p>
    <button class="primary" data-result-domain="${weakest.id}">Drill ${weakest.name.toLowerCase()}</button>
  `;
  $('[data-result-domain]').onclick = () => startSession({ mode: 'domain', domainId: weakest.id, limit: 10 });

  $('#questionReview').innerHTML = attempt.responses.map((response, index) => `
    <article class="review-card">
      <div><strong>Question ${index + 1} · ${response.family}</strong><span class="status-badge ${response.correct ? 'success' : 'destructive'}">${response.correct ? 'Correct' : 'Incorrect'}</span></div>
      <p>${response.promptSnapshot}</p>
      <p><strong>Your answer:</strong> ${response.selected === null ? 'No answer' : response.optionsSnapshot[response.selected]}</p>
      <p><strong>Correct answer:</strong> ${response.optionsSnapshot[response.correctAnswer]}</p>
      <p>${response.explanationSnapshot}</p>
      <p><strong>Reasoning rule:</strong> Stay inside the stated evidence and choose only what the prompt logically supports.</p>
      <p><strong>Common trap:</strong> Selecting a plausible answer that adds assumptions not present in the passage.</p>
      <p><strong>Response time:</strong> ${response.timeSeconds}s · <strong>Confidence:</strong> ${response.confidence || 2}/3</p>
      <button class="secondary" data-bookmark="${response.questionId}">${state.bookmarks.includes(response.questionId) ? 'Bookmarked' : 'Bookmark'}</button>
      <button class="secondary" data-report-question="${response.questionId}">Report question</button>
    </article>
  `).join('');
  $$('[data-bookmark]').forEach(button => button.onclick = () => toggleBookmark(button.dataset.bookmark));
  $$('[data-report-question]').forEach(button => button.onclick = () => showToast(`Report captured locally for ${button.dataset.reportQuestion}.`));
}

function calibrationSentence(responses) {
  const wrong = responses.filter(response => !response.correct).length;
  if (wrong) return `${wrong} wrong answer${wrong === 1 ? '' : 's'} saved for review.`;
  return 'No wrong answers in this set.';
}

function toggleBookmark(questionId) {
  state.bookmarks = state.bookmarks.includes(questionId)
    ? state.bookmarks.filter(id => id !== questionId)
    : [...state.bookmarks, questionId];
  saveState();
  renderAll();
  showToast(state.bookmarks.includes(questionId) ? 'Question bookmarked.' : 'Bookmark removed.');
}

function renderReview() {
  const bank = new Map(allQuestions().map(question => [question.id, question]));
  const filter = $('#reviewFilter')?.value || 'all';
  const domainFilter = $('#reviewDomainFilter')?.value || 'all';
  const term = ($('#reviewSearch')?.value || '').toLowerCase();
  if ($('#reviewDomainFilter') && !$('#reviewDomainFilter').options.length) {
    $('#reviewDomainFilter').innerHTML = '<option value="all">All domains</option>' + domains.map(domain => `<option value="${domain.id}">${domain.name}</option>`).join('');
  }
  let items = state.reviewItems;
  if (filter === 'due') items = items.filter(item => item.reviewState !== 'cleared' && item.dueAt <= now());
  if (filter === 'bookmarked') items = items.filter(item => state.bookmarks.includes(item.questionId));
  if (filter === 'cleared') items = items.filter(item => item.reviewState === 'cleared');
  if (filter === 'flagged') items = items.filter(item => item.flagged || item.reason === 'Flagged for review');
  if (filter === 'slow') items = items.filter(item => Number(item.timeSeconds || 0) >= 90);
  if (domainFilter !== 'all') items = items.filter(item => item.domainId === domainFilter);
  if (term) items = items.filter(item => `${item.questionId} ${item.family} ${item.domainId}`.toLowerCase().includes(term));
  if ($('#reviewView')?.classList.contains('active')) {
    const params = new URLSearchParams(location.search);
    params.set('view', 'review');
    params.set('filter', filter);
    if (domainFilter !== 'all') params.set('domain', domainFilter);
    else params.delete('domain');
    history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
  }

  const openItems = items.filter(item => item.reviewState !== 'cleared' || filter === 'cleared');
  const activeItems = state.reviewItems.filter(item => item.reviewState !== 'cleared');
  const domainCounts = domains.map(domain => ({
    ...domain,
    count: activeItems.filter(item => item.domainId === domain.id).length
  }));
  const domainCards = `
    <section class="review-domain-grid">
      ${domainCounts.map(domain => `
        <article class="review-domain-card ${domain.count ? '' : 'empty-domain'}">
          <span>${domain.name}</span>
          <strong>${domain.count}</strong>
          <small>wrong answer${domain.count === 1 ? '' : 's'}</small>
          <button class="secondary full" data-review-domain="${domain.id}" ${domain.count ? '' : 'disabled'}>Review ${domain.name}</button>
        </article>
      `).join('')}
    </section>
  `;

  const reviewList = openItems.length ? openItems.map(item => {
    const question = bank.get(item.questionId);
    return `
      <article class="review-card">
        <div><strong>${item.family}</strong><span>${item.reason}</span></div>
        <p>${question?.prompt || 'Question snapshot unavailable.'}</p>
        <small>${item.reviewCount ? `Reviewed ${item.reviewCount} times` : 'Ready now'} · ${item.timeSeconds ? `${item.timeSeconds}s` : 'No timing'} · ${item.reviewState}</small>
        <div class="inline-actions">
          <button class="primary" data-review-start="${item.questionId}">Practise this</button>
          <button class="secondary" data-review-clear="${item.questionId}">Mark clear</button>
        </div>
      </article>
    `;
  }).join('') : '<p class="empty">No wrong answers yet. Complete a mock or domain drill and missed questions will appear here.</p>';

  $('#reviewQueue').innerHTML = domainCards + reviewList;

  $$('[data-review-domain]').forEach(button => {
    button.onclick = () => {
      const ids = activeItems.filter(item => item.domainId === button.dataset.reviewDomain).map(item => item.questionId);
      if (!ids.length) return;
      startSession({ mode: 'review', limit: ids.length, feedbackMode: 'end', questionIds: ids });
    };
  });

  $$('[data-review-start]').forEach(button => button.onclick = () => {
    const question = bank.get(button.dataset.reviewStart);
    if (!question) return;
    state.currentSession = {
      id: crypto.randomUUID(),
      type: 'practice',
      mock: 'none',
      mode: 'review',
      feedbackMode: 'immediate',
      startedAt: now(),
      expiresAt: null,
      currentIndex: 0,
      questions: [question.id],
      responses: {}
    };
    saveState();
    setView('assessment');
    renderAssessment();
  });

  $$('[data-review-clear]').forEach(button => button.onclick = () => {
    const item = state.reviewItems.find(item => item.questionId === button.dataset.reviewClear);
    if (item) {
      item.reviewState = 'cleared';
      item.lastReviewedAt = now();
      item.reviewCount += 1;
      saveState();
      renderAll();
      showToast('Review item marked clear.');
    }
  });
}

function renderProgress() {
  const metrics = computeMetrics();
  $('#progressHero').innerHTML = [
    ['Questions completed', metrics.responses.length, 'All submitted attempts'],
    ['Average accuracy', `${metrics.accuracy}%`, 'Correct / answered'],
    ['Wrong answers', state.reviewItems.filter(item => item.reviewState !== 'cleared').length, 'In review'],
    ['Best domain', bestDomain(metrics), 'By accuracy']
  ].map(item => `<article><small>${item[0]}</small><strong>${item[1]}</strong><span>${item[2]}</span></article>`).join('');
  $('#progressBars').innerHTML = metrics.byDomain.map(domain => analyticsRow(
    domain.name,
    domain.attempted ? domain.accuracy : 0,
    domain.attempted ? `${domain.accuracy}% correct · ${domain.correct}/${domain.attempted}` : 'No questions attempted yet'
  )).join('');
  const weakest = [...metrics.byDomain].filter(domain => domain.attempted).sort((a, b) => a.accuracy - b.accuracy)[0];
  $('#calibrationPanel').innerHTML = weakest
    ? `<p><strong>${weakest.name}</strong> is currently your weakest domain at ${weakest.accuracy}%.</p><button class="primary" data-weak-domain="${weakest.id}">Practise ${weakest.name}</button>`
    : '<p>Complete a mock or domain drill to see your weakest area.</p>';
  $('[data-weak-domain]')?.addEventListener('click', event => startSession({ mode: 'domain', domainId: event.target.dataset.weakDomain, limit: 10, feedbackMode: 'end' }));
  $('#attemptHistory').innerHTML = state.attempts.length ? state.attempts.map(attempt => `
    <div><span>${attempt.type}</span><strong>${attempt.accuracy}%</strong><small>${new Date(attempt.submittedAt).toLocaleString()}</small></div>
  `).join('') : '<p class="empty">No attempts yet.</p>';
}

function bestDomain(metrics) {
  const attempted = metrics.byDomain.filter(domain => domain.attempted);
  if (!attempted.length) return '-';
  return attempted.sort((a, b) => b.accuracy - a.accuracy)[0].name;
}

function analyticsRow(label, score, note) {
  return `<div class="analytics-row"><div><strong>${label}</strong><span>${note}</span></div><div class="bar"><i style="width:${Math.max(0, Math.min(100, score))}%"></i></div></div>`;
}

function renderStudyPlan() {
  const metrics = computeMetrics();
  const weak = [...metrics.byDomain].sort((a, b) => a.mastery - b.mastery).slice(0, 2);
  const minutes = Number($('#weeklyMinutes')?.value || 180);
  const target = $('#targetDate')?.value ? new Date($('#targetDate').value) : null;
  const weeks = target ? Math.max(1, Math.ceil((target.getTime() - now()) / 604800000)) : 4;
  const weeklyQuestions = Math.max(20, Math.round(minutes / 3));
  $('#studyPlanOutput').innerHTML = `
    <article class="plan-week">
      <span>${weeks} week plan</span>
      <h3>${weeklyQuestions} questions per week, with ${Math.round(minutes * 0.25)} minutes reserved for review.</h3>
      <p>Priority domains: <strong>${weak.map(domain => domain.name).join(' and ')}</strong>.</p>
    </article>
    ${Array.from({ length: Math.min(weeks, 6) }, (_, index) => `
      <article class="plan-week">
        <span>Week ${index + 1}</span>
        <h3>${index % 2 ? 'Mixed practice plus review' : `${weak[0].name} focus`}</h3>
        <p>${index % 2 ? 'Complete one mini mock, review every miss, then run a short mixed drill.' : `Spend the first half on lessons and the second half on ${weak[0].name.toLowerCase()} drills.`}</p>
      </article>
    `).join('')}
  `;
}

function renderAdmin() {
  const allowed = ['reviewer', 'admin'].includes(state.role);
  $('#adminLock').classList.toggle('hidden', allowed);
  $('#adminConsole').classList.toggle('hidden', !allowed);
  $('#adminLock').innerHTML = `
    <article class="access-lock-panel">
      <span>Student role</span>
      <h3>Admin tools are unavailable to students.</h3>
      <p>Switch to content reviewer or administrator in this local preview to inspect the management workflows. In production, Supabase policies and server routes must enforce the same restrictions.</p>
    </article>
  `;
  if (!allowed) return;

  const bank = allQuestions();
  const inReview = bank.filter(question => question.status === 'in_review').length;
  $('#adminStats').innerHTML = [
    ['Question records', bank.length.toLocaleString(), 'Original generated bank'],
    ['Awaiting review', inReview, 'Seed review queue'],
    ['Attempts', state.attempts.length, 'Local user data'],
    ['Feedback items', state.reviewItems.length, 'Student review queue']
  ].map(item => `<article><small>${item[0]}</small><strong>${item[1]}</strong><span>${item[2]}</span></article>`).join('');

  const adminSearch = ($('#adminSearch')?.value || '').toLowerCase().trim();
  const statusFilter = $('#adminStatusFilter')?.value || 'all';
  const filteredQuestions = bank
    .filter(question => statusFilter === 'all' || question.status === statusFilter)
    .filter(question => !adminSearch || `${question.id} ${question.family} ${question.domainId} ${question.status}`.toLowerCase().includes(adminSearch));
  $('#adminQuestions').innerHTML = filteredQuestions.slice(0, 12).map(question => `
    <div class="admin-row">
      <span><strong>${question.id}</strong>${question.family}</span>
      <small><span class="status-badge ${question.status === 'published' ? 'success' : 'warning'}">${question.status.replace('_', ' ')}</span> · v${question.version}</small>
      <button class="secondary" data-preview-question="${question.id}">Preview</button>
    </div>
  `).join('') || '<p class="empty">No questions match these filters.</p>';
  $$('[data-preview-question]').forEach(button => button.onclick = () => {
    const question = bank.find(item => item.id === button.dataset.previewQuestion);
    showToast(`${question.id}: ${question.explanation.slice(0, 90)}...`);
  });

  $('#reviewWorkflow').innerHTML = [
    ['Draft', 'Question is created by an author or AI draft workflow.'],
    ['Submitted for review', 'Reviewer checks clarity, answer security and originality.'],
    ['Changes requested', 'Author revises with audit trail.'],
    ['Approved', 'Reviewer identity, notes and timestamp are stored.'],
    ['Published', 'Students can receive the question through protected delivery.']
  ].map(step => `<div class="admin-row"><span><strong>${step[0]}</strong>${step[1]}</span></div>`).join('');

  $('#schemaBox').textContent = schemaSummary();
  $('#auditLog').innerHTML = state.auditLogs.map(log => `
    <div><span>${log.action}</span><strong>${log.actor}</strong><small>${new Date(log.at).toLocaleString()}</small></div>
  `).join('');
}

function schemaSummary() {
  return `Core production tables:
profiles, user_preferences, subscriptions, entitlement_grants,
questions, question_tags, question_versions, lessons, lesson_steps,
test_templates, test_attempts, attempt_questions, attempt_responses,
domain_progress, review_items, study_plans, question_feedback,
admin_audit_logs, ai_drafts, ai_quality_reviews.

Server-only environment variables:
SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
OPENAI_API_KEY, POSTHOG_PERSONAL_API_KEY.

Public browser variables:
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
NEXT_PUBLIC_POSTHOG_KEY.

Security rule:
students can read/write only their own profile, attempts, responses,
review queue and study plans. Reviewers can manage question review.
Admins can manage users, entitlements, publishing and audit logs.`;
}

function renderAccount() {
  $('#roleSelect').value = state.role;
  $('#profileName').value = state.profile.name;
  $('#profileEmail').value = state.profile.email;
  $('#profileSector').value = state.profile.sector;
  $('#dailyTarget').value = state.profile.dailyTarget;
  $('#profilePlan').value = state.profile.plan;
  $('#emailConsent').checked = state.profile.emailConsent;
  $('#entitlementList').innerHTML = entitlementRows().map(row => `<div><span>${row[0]}</span><strong>${row[1]}</strong></div>`).join('');
}

async function startCheckout(plan) {
  const email = state.profile.email || window.prompt('Enter the email address for checkout:');
  if (!email) return showToast('Add an email before checkout.');
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email })
    });
    const payload = await response.json();
    if (!response.ok || !payload.url) throw new Error(payload.error || 'Checkout unavailable.');
    window.location.href = payload.url;
  } catch (error) {
    showToast(error.message || 'Stripe checkout is not configured yet.');
  }
}

function entitlementRows() {
  const plan = state.profile.plan;
  const pro = ['pro', 'institution'].includes(plan);
  return [
    ['Original question bank', pro ? 'Full access' : plan === 'daily' ? 'Daily limit' : 'Preview only'],
    ['Specialised drills', pro ? 'Unlocked' : 'Upgrade required'],
    ['Advanced analytics', pro ? 'Unlocked' : 'Basic only'],
    ['Mistake review', plan === 'free' ? 'Limited' : 'Unlocked'],
    ['Admin access', state.role === 'admin' ? 'Administrator' : state.role === 'reviewer' ? 'Reviewer' : 'No']
  ];
}

function renderAll() {
  renderDashboard();
  renderLessons();
  renderPractice();
  renderResults();
  renderReview();
  renderProgress();
  renderFirmData();
  renderStudyPlan();
  renderAdmin();
  renderAccount();
}

function bindEvents() {
  $$('[data-view]').forEach(button => button.onclick = () => {
    setView(button.dataset.view);
    $('#primaryNav')?.classList.remove('open');
    $('#mobileMenuButton')?.setAttribute('aria-expanded', 'false');
  });
  $('#mobileMenuButton').onclick = () => {
    const nav = $('#primaryNav');
    const open = nav.classList.toggle('open');
    $('#mobileMenuButton').setAttribute('aria-expanded', String(open));
  };
  $$('[data-view-jump], [data-view-link]').forEach(button => {
    button.onclick = event => {
      event.preventDefault();
      setView(button.dataset.viewJump || button.dataset.viewLink);
      $('#primaryNav')?.classList.remove('open');
      $('#mobileMenuButton')?.setAttribute('aria-expanded', 'false');
    };
  });
  $('#roleSelect').onchange = event => {
    state.role = event.target.value;
    state.auditLogs.unshift({ at: now(), actor: state.role, action: `Role switched to ${state.role} in local preview.` });
    saveState();
    renderAll();
  };
  $('#startPractice').onclick = () => startSession({
    mode: $('#practiceMode').value,
    domainId: $('#domainSelect').value,
    limit: Number($('#questionLimit').value),
    difficulty: $('#difficultySelect').value,
    feedbackMode: $('#feedbackMode').value
  });
  $$('[data-start-mock]').forEach(button => button.onclick = () => startSession({ type: 'mock', mock: button.dataset.startMock }));
  $('#checkAnswer').onclick = () => {
    const question = getCurrentQuestions()[state.currentSession?.currentIndex || 0];
    const selected = Number($('#answerOptions .option.selected')?.dataset.option);
    if (!Number.isInteger(selected) || !question) return showToast('Choose an answer first.');
    saveResponse(question, selected, true);
  };
  $('#nextQuestion').onclick = () => {
    if (!state.currentSession) return;
    state.currentSession.currentIndex = Math.min(getCurrentQuestions().length - 1, state.currentSession.currentIndex + 1);
    saveState();
    renderAssessment();
  };
  $('#previousQuestion').onclick = () => {
    if (!state.currentSession) return;
    state.currentSession.currentIndex = Math.max(0, state.currentSession.currentIndex - 1);
    saveState();
    renderAssessment();
  };
  $('#clearAnswer').onclick = () => {
    const question = getCurrentQuestions()[state.currentSession?.currentIndex || 0];
    if (question) {
      delete state.currentSession.responses[question.id];
      saveState();
      renderAssessment();
    }
  };
  $('#flagQuestion').onchange = () => {
    const question = getCurrentQuestions()[state.currentSession?.currentIndex || 0];
    if (!question || !state.currentSession.responses[question.id]) return;
    state.currentSession.responses[question.id].flagged = $('#flagQuestion').checked;
    saveState();
    renderAssessment();
  };
  $('#submitAttempt').onclick = submitAttempt;
  $('#startDueReview').onclick = () => startSession({ mode: 'review', limit: 10 });
  $('#reviewFilter').onchange = renderReview;
  $('#reviewDomainFilter').onchange = renderReview;
  $('#reviewSearch').oninput = renderReview;
  $('#firmCriterion').onchange = renderFirmData;
  $('#firmSearch').oninput = renderFirmData;
  $('#clearClearedReviews').onclick = () => {
    state.reviewItems = state.reviewItems.filter(item => item.reviewState !== 'cleared');
    saveState();
    renderAll();
  };
  $('#generatePlan').onclick = renderStudyPlan;
  $('#adminSearch').oninput = renderAdmin;
  $('#adminStatusFilter').onchange = renderAdmin;
  $('#adminResetFilters').onclick = () => {
    $('#adminSearch').value = '';
    $('#adminStatusFilter').value = 'all';
    renderAdmin();
  };
  $$('[data-checkout-plan]').forEach(button => {
    button.onclick = () => startCheckout(button.dataset.checkoutPlan);
  });
  $$('[data-plan-local]').forEach(button => {
    button.onclick = () => {
      state.profile.plan = button.dataset.planLocal;
      saveState();
      renderAll();
      showToast('Free preview selected.');
    };
  });
  $('#profileForm').onsubmit = event => {
    event.preventDefault();
    state.profile = {
      name: $('#profileName').value.trim(),
      email: $('#profileEmail').value.trim(),
      sector: $('#profileSector').value,
      plan: $('#profilePlan').value,
      dailyTarget: Number($('#dailyTarget').value),
      emailConsent: $('#emailConsent').checked,
      onboardingCompleted: true
    };
    saveState();
    renderAll();
    showToast('Profile saved.');
  };
}

function init() {
  bindEvents();
  renderAll();
  const params = new URLSearchParams(location.search);
  const requestedView = params.get('view');
  if ($('#reviewFilter') && params.get('filter')) $('#reviewFilter').value = params.get('filter');
  if ($('#reviewDomainFilter') && params.get('domain')) $('#reviewDomainFilter').value = params.get('domain');
  if (requestedView && titleMap[requestedView]) setView(requestedView);
  timerHandle = setInterval(() => {
    if (state.currentSession && !$('#assessmentStage').classList.contains('hidden')) renderTimer();
  }, 1000);
}

init();
