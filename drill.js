const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const params = new URLSearchParams(window.location.search);
const sessionId = params.get('session') || window.getVerdictStartSession?.() || 'daily';
const accessAllowed = window.canAccessVerdictSession?.(sessionId) ?? true;
const drillMap = window.VERDICT_DRILLS || {};
const session = drillMap[sessionId] || drillMap.daily || drillMap.mixed || { title: 'Practice session', family: 'Watson Glaser practice' };
const questions = accessAllowed && window.getVerdictQuestions ? window.getVerdictQuestions(sessionId) : [];
const answers = new Map();

let current = 0;
let selected = null;
let seconds = 0;

function formatTime(value) {
  const minutes = String(Math.floor(value / 60)).padStart(2, '0');
  const secs = String(value % 60).padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateStats() {
  const answered = [...answers.values()];
  const correct = answered.filter(item => item.correct).length;
  const accuracy = answered.length ? Math.round((correct / answered.length) * 100) : 0;
  $('#scoreText').textContent = `${correct} / ${answered.length}`;
  $('#accuracyText').textContent = `${accuracy}% accuracy`;
  $('#answeredText').textContent = answered.length;
  $('#remainingText').textContent = `${questions.length - answered.length} remaining`;
  $('#progressFill').style.width = questions.length ? `${Math.round((answered.length / questions.length) * 100)}%` : '0%';
}

function renderNavigator() {
  const visible = questions.slice(0, 80);
  $('#navigatorGrid').innerHTML = visible.map((question, index) => {
    const saved = answers.get(index);
    const status = saved ? (saved.correct ? 'correct' : 'wrong') : (index === current ? 'active' : '');
    return `<button class="${status}" data-jump="${index}" aria-label="Go to question ${index + 1}">${index + 1}</button>`;
  }).join('');

  $$('[data-jump]').forEach(button => {
    button.onclick = () => {
      current = Number(button.dataset.jump);
      renderQuestion();
    };
  });
}

function renderQuestion() {
  if (!questions.length) {
    renderLoadError();
    return;
  }
  const question = questions[current];
  const saved = answers.get(current);
  selected = saved?.selected ?? null;

  $('#questionFamily').textContent = question.family;
  $('#questionNumber').textContent = `Question ${current + 1} of ${questions.length}`;
  $('#questionPrompt').textContent = question.prompt;
  $('#feedback').innerHTML = saved ? `<strong>${saved.correct ? 'Correct.' : 'Not quite.'}</strong> ${question.explanation}` : '';
  $('#checkAnswer').disabled = selected === null || Boolean(saved);

  $('#answerOptions').innerHTML = question.options.map((option, index) => {
    const selectedClass = selected === index ? 'selected' : '';
    const correctClass = saved && index === question.answer ? 'correct' : '';
    const wrongClass = saved && selected === index && !saved.correct ? 'wrong' : '';
    return `<button class="option ${selectedClass} ${correctClass} ${wrongClass}" data-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`;
  }).join('');

  $$('.option').forEach(button => {
    button.onclick = () => {
      if (answers.has(current)) return;
      selected = Number(button.dataset.option);
      $$('.option').forEach(node => node.classList.remove('selected'));
      button.classList.add('selected');
      $('#checkAnswer').disabled = false;
    };
  });

  renderNavigator();
  updateStats();
}

function checkAnswer() {
  if (selected === null || answers.has(current)) return;
  const question = questions[current];
  const correct = selected === question.answer;
  answers.set(current, { selected, correct });
  renderQuestion();
}

function nextQuestion() {
  if (!questions.length) return;
  current = (current + 1) % questions.length;
  renderQuestion();
}

function previousQuestion() {
  if (!questions.length) return;
  current = (current - 1 + questions.length) % questions.length;
  renderQuestion();
}

function skipQuestion() {
  nextQuestion();
}

function init() {
  if (!accessAllowed) {
    const plan = window.VERDICT_PLANS?.[window.getVerdictPlan?.() || 'daily'];
    document.title = 'Verdict — Upgrade required';
    document.querySelector('.drill-shell').innerHTML = `
      <header class="drill-topbar">
        <a class="brand" href="index.html" aria-label="Back to Verdict dashboard">
          <span class="brand-mark">V</span>
          <span><strong>Verdict</strong><small>Access control</small></span>
        </a>
        <a class="secondary drill-exit" href="index.html">Back to dashboard</a>
      </header>
      <section class="access-lock-panel">
        <span>Plan limit reached</span>
        <h1>This session is not included in ${plan?.name || 'your current plan'}.</h1>
        <p>The Daily plan includes one limited mixed Watson Glaser test each day. Specialised drills and the full question bank are reserved for Unlimited and Lifetime subscribers.</p>
        <div>
          <a class="primary" href="index.html?view=plans">View plans</a>
          <a class="secondary" href="drill.html?session=daily">Start daily test</a>
        </div>
      </section>
    `;
    return;
  }
  if (!questions.length) {
    renderLoadError();
    return;
  }
  document.title = `Verdict — ${session.title}`;
  $('#drillTitle').textContent = session.title;
  $('#drillFamily').textContent = session.family;
  $('#bankSize').textContent = questions.length.toLocaleString();
  const bankNote = document.querySelector('.bank-note');
  if (bankNote && sessionId === 'daily') {
    bankNote.textContent = 'Daily plan session: this is a limited mixed Watson Glaser-style test, not the full question bank or a focused drill.';
  }
  $('#checkAnswer').onclick = checkAnswer;
  $('#nextQuestion').onclick = nextQuestion;
  $('#previousQuestion').onclick = previousQuestion;
  $('#skipQuestion').onclick = skipQuestion;
  setInterval(() => {
    seconds += 1;
    $('#timerText').textContent = formatTime(seconds);
  }, 1000);
  renderQuestion();
}

function renderLoadError() {
  document.title = 'Verdict — Session unavailable';
  document.querySelector('.drill-shell').innerHTML = `
    <header class="drill-topbar">
      <a class="brand" href="index.html" aria-label="Back to Verdict dashboard">
        <span class="brand-mark">V</span>
        <span><strong>Verdict</strong><small>Practice session</small></span>
      </a>
      <a class="secondary drill-exit" href="index.html?view=practice">Back to practice</a>
    </header>
    <section class="access-lock-panel">
      <span>Session unavailable</span>
      <h1>We could not load the question bank for this session.</h1>
      <p>This can happen if the page is cached or one of the static practice files did not load. Refresh the page, or return to the practice screen and start a new session.</p>
      <div>
        <a class="primary" href="index.html?view=practice">Back to practice</a>
        <a class="secondary" href="drill.html?session=daily">Try daily test</a>
      </div>
    </section>
  `;
}

init();
