const $ = selector => document.querySelector(selector);

const params = new URLSearchParams(window.location.search);
const slug = params.get('firm') || 'clifford-chance';
const firm = window.LAW_FIRMS.find(item => item.slug === slug) || window.LAW_FIRMS[0];

function chips(items) {
  return items.map(item => `<span>${item}</span>`).join('');
}

function targetTiers(tiers) {
  return [
    ['Strong targets', tiers.strong],
    ['Mid targets', tiers.mid],
    ['Weak / less common targets', tiers.weak]
  ].map(([label, items]) => `
    <section>
      <h4>${label}</h4>
      <div class="chip-list">${chips(items)}</div>
    </section>
  `).join('');
}

function renderSeatCategories(categories) {
  return Object.entries(categories).map(([label, items]) => `
    <section>
      <h4>${label}</h4>
      <div class="chip-list">${chips(items)}</div>
    </section>
  `).join('');
}

function insight(items) {
  return items.map(item => `<div>${item}</div>`).join('');
}

function facts(firm) {
  return [
    ['Training contracts', firm.traineeSeats],
    ['Countries', firm.countries || 'Verify'],
    ['Retention', firm.retention || 'Verify'],
    ['PEP', firm.pep || 'Verify'],
    ['PGDL grant', firm.grants?.pgdl || 'Verify'],
    ['SQE grant', firm.grants?.sqe || 'Verify']
  ].map(([label, value]) => `<article><small>${label}</small><strong>${value}</strong></article>`).join('');
}

function hoursFacts(firm) {
  return [
    ['Typical start', firm.hours?.start || 'Verify'],
    ['Typical finish', firm.hours?.finish || 'Verify'],
    ['Billable target', firm.hours?.target || 'Verify'],
    ['Annual leave', firm.hours?.annualLeave || 'Verify'],
    ['International secondment', firm.secondments?.abroad || 'Verify'],
    ['Client secondment', firm.secondments?.client || 'Verify']
  ].map(([label, value]) => `<article><small>${label}</small><strong>${value}</strong></article>`).join('');
}

function requirements(firm) {
  return [
    ['A-levels', firm.requirements?.alevel || 'Check firm site'],
    ['Degree', firm.requirements?.degree || 'Check firm site']
  ].map(([label, value]) => `<span><small>${label}</small>${value}</span>`).join('');
}

function scorecard(scorecard) {
  if (!scorecard) return '<p class="muted-copy">No scorecard data is embedded for this firm yet. Use the source links below to check the live profile.</p>';
  return Object.entries(scorecard).map(([label, grade]) => `
    <article>
      <span>${label}</span>
      <strong>${grade}</strong>
    </article>
  `).join('');
}

function sourceLinks(sources) {
  return sources.map(source => `<a href="${source.url}" target="_blank" rel="noopener">${source.label}</a>`).join('');
}

function init() {
  document.title = `Verdict — ${firm.name}`;
  $('#firmTag').textContent = firm.tag;
  $('#firmName').textContent = firm.name;
  $('#firmNote').textContent = firm.note;
  $('#firmSeats').textContent = firm.traineeSeats;
  $('#firmSourceBadge').textContent = firm.sourceBadge;
  $('#firmSourceStatus').textContent = firm.sourceStatus;
  $('#firmOffices').textContent = firm.offices;
  $('#firmFootprint').textContent = firm.footprint;
  $('#firmTraineeOne').textContent = firm.salary.traineeFirst;
  $('#firmTraineeTwo').textContent = firm.salary.traineeSecond;
  $('#firmNqSalary').textContent = firm.salary.newlyQualified;
  $('#firmFactGrid').innerHTML = facts(firm);
  $('#firmHoursGrid').innerHTML = hoursFacts(firm);
  $('#firmRequirements').innerHTML = requirements(firm);
  $('#firmScorecard').innerHTML = scorecard(firm.scorecard);
  $('#salaryTrackOne').textContent = firm.salary.traineeFirst;
  $('#salaryTrackTwo').textContent = firm.salary.traineeSecond;
  $('#salaryTrackNq').textContent = firm.salary.newlyQualified;
  $('#salarySourceNote').textContent = firm.sourceStatus;
  $('#firmSeatCategories').innerHTML = renderSeatCategories(firm.seatCategories);
  $('#firmUniversityTiers').innerHTML = targetTiers(firm.universityTargets);
  $('#firmApplication').textContent = firm.applicationNotes;
  $('#firmVacation').textContent = firm.vacationScheme;
  $('#firmBestFor').innerHTML = insight(firm.bestFor);
  $('#firmQuestions').innerHTML = insight(firm.whatStudentsAsk);
  $('#firmSources').innerHTML = sourceLinks(firm.sources);
}

init();
