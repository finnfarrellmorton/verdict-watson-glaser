const $ = selector => document.querySelector(selector);

const rankingConfig = {
  firms: {
    eyebrow: 'FIRM RANKINGS',
    insight: ['Look beyond prestige.', 'Use firm rankings to compare training scale, work quality, lifestyle, pay, and international exposure. The best firm is the one whose environment matches how you want to train.'],
    criteria: [
      ['traineeSeats', 'Training contract seats'],
      ['prestige', 'Overall student interest'],
      ['pay', 'Newly qualified pay'],
      ['work', 'Work quality'],
      ['balance', 'Work/life balance'],
      ['international', 'International exposure'],
      ['offices', 'Office footprint']
    ],
    rows: window.LAW_FIRMS
  },
  seats: {
    eyebrow: 'SEAT RANKINGS',
    insight: ['Pick seats by skill fit.', 'Seats are different training environments. Corporate rewards transaction management; disputes rewards evidence and argument; finance rewards structure and precision.'],
    criteria: [
      ['demand', 'Student demand'],
      ['training', 'Training value'],
      ['responsibility', 'Early responsibility'],
      ['commercial', 'Commercial awareness value'],
      ['court', 'Court exposure']
    ],
    rows: [
      { name: 'Corporate / M&A', tag: 'Transactional', demand: 96, training: 88, responsibility: 72, commercial: 96, court: 20, note: 'Deal process, negotiation, diligence, disclosure and client management.' },
      { name: 'Disputes / Litigation', tag: 'Contentious', demand: 90, training: 92, responsibility: 78, commercial: 82, court: 86, note: 'Evidence, correspondence, pleadings, strategy and court procedure.' },
      { name: 'Banking & Finance', tag: 'Transactional', demand: 84, training: 86, responsibility: 76, commercial: 94, court: 18, note: 'Facility agreements, security, covenants and transaction timetables.' },
      { name: 'Private Equity', tag: 'Transactional', demand: 88, training: 82, responsibility: 70, commercial: 96, court: 12, note: 'Fast-moving deals, sponsor clients and high-pressure execution.' },
      { name: 'Competition / Antitrust', tag: 'Regulatory', demand: 78, training: 88, responsibility: 74, commercial: 90, court: 48, note: 'Merger control, market analysis, investigations and regulators.' },
      { name: 'Employment', tag: 'Advisory/contentious', demand: 70, training: 84, responsibility: 82, commercial: 78, court: 54, note: 'Advisory calls, tribunal exposure, investigations and policy work.' },
      { name: 'Real Estate', tag: 'Transactional', demand: 68, training: 80, responsibility: 82, commercial: 80, court: 18, note: 'Leases, development, investment, finance and asset management.' },
      { name: 'Technology / IP', tag: 'Advisory', demand: 76, training: 82, responsibility: 76, commercial: 86, court: 44, note: 'Data, software, brand, licensing and digital regulation.' }
    ]
  },
  courts: {
    eyebrow: 'COURTS & CHAMBERS',
    insight: ['Map advocacy exposure.', 'Use this view to compare court-facing pathways: commercial disputes, chancery, construction, public law, employment and specialist tribunals.'],
    criteria: [
      ['advocacy', 'Advocacy exposure'],
      ['commercial', 'Commercial complexity'],
      ['training', 'Training reputation'],
      ['pupillage', 'Pupillage competitiveness'],
      ['solicitorRelevance', 'Solicitor seat relevance']
    ],
    rows: [
      { name: 'Commercial Court', tag: 'High-value disputes', advocacy: 92, commercial: 98, training: 88, pupillage: 94, solicitorRelevance: 86, note: 'Contract, banking, insurance, commodities, civil fraud and international disputes.' },
      { name: 'Chancery Division', tag: 'Business/property/equity', advocacy: 84, commercial: 92, training: 86, pupillage: 90, solicitorRelevance: 82, note: 'Company, insolvency, trusts, property and complex equitable remedies.' },
      { name: 'Technology and Construction Court', tag: 'Projects/technical', advocacy: 86, commercial: 90, training: 84, pupillage: 86, solicitorRelevance: 78, note: 'Construction, engineering, procurement, technology and professional negligence.' },
      { name: 'Competition Appeal Tribunal', tag: 'Regulatory/economic', advocacy: 82, commercial: 94, training: 84, pupillage: 88, solicitorRelevance: 84, note: 'Competition damages, merger decisions, market investigations and economic evidence.' },
      { name: 'Employment Tribunal', tag: 'People/workplace', advocacy: 88, commercial: 72, training: 82, pupillage: 78, solicitorRelevance: 74, note: 'Dismissal, discrimination, whistleblowing, redundancy and workplace claims.' },
      { name: 'Supreme Court', tag: 'Appeals', advocacy: 98, commercial: 88, training: 94, pupillage: 98, solicitorRelevance: 70, note: 'Appeals on points of law with constitutional, commercial or public importance.' },
      { name: 'Administrative Court', tag: 'Public law', advocacy: 90, commercial: 72, training: 84, pupillage: 86, solicitorRelevance: 66, note: 'Judicial review, public bodies, human rights, immigration and regulatory challenge.' },
      { name: 'International Arbitration', tag: 'Global disputes', advocacy: 86, commercial: 96, training: 88, pupillage: 90, solicitorRelevance: 88, note: 'Cross-border commercial, energy, construction and investment disputes.' }
    ]
  }
};

let activeView = 'firms';
let activeCriterion = 'training';

function setCriteria() {
  const view = rankingConfig[activeView];
  $('#rankingCriteria').innerHTML = view.criteria.map(([value, label]) => `<option value="${value}">${label}</option>`).join('');
  activeCriterion = view.criteria[0][0];
}

function renderRankings() {
  const view = rankingConfig[activeView];
  const search = $('#rankingSearch').value.trim().toLowerCase();
  const criterionLabel = view.criteria.find(([value]) => value === activeCriterion)?.[1] || 'Ranking';
  const rows = view.rows
    .filter(row => !search || `${row.name} ${row.tag} ${row.note} ${(row.seats || []).join(' ')} ${(row.universities || []).join(' ')}`.toLowerCase().includes(search))
    .sort((a, b) => b[activeCriterion] - a[activeCriterion]);

  $('#rankingEyebrow').textContent = view.eyebrow;
  $('#rankingTitle').textContent = criterionLabel;
  $('#rankingCount').textContent = `${rows.length} result${rows.length === 1 ? '' : 's'}`;
  $('#insightTitle').textContent = view.insight[0];
  $('#insightCopy').textContent = view.insight[1];

  $('#rankingList').innerHTML = rows.map((row, index) => `
    <article class="ranking-row ${activeView === 'firms' ? 'clickable' : ''}" ${activeView === 'firms' ? `data-firm="${row.slug}"` : ''}>
      <span class="rank-number">${index + 1}</span>
      <div class="ranking-main">
        <div><h3>${row.name}</h3><span>${row.tag}</span></div>
        <p>${row.note}</p>
        ${activeView === 'firms' ? `<p class="ranking-extra">${row.traineeSeats} training contract seats · ${row.offices} offices · ${row.seats.slice(0, 4).join(', ')}</p>` : ''}
      </div>
      <div class="ranking-score">
        <strong>${row[activeCriterion]}</strong>
        <small>${['traineeSeats','offices'].includes(activeCriterion) ? '' : '/100'}</small>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-firm]').forEach(row => {
    row.onclick = () => {
      window.location.href = `firm.html?firm=${encodeURIComponent(row.dataset.firm)}`;
    };
  });
}

function init() {
  setCriteria();
  renderRankings();
  $('#rankingView').onchange = event => {
    activeView = event.target.value;
    setCriteria();
    renderRankings();
  };
  $('#rankingCriteria').onchange = event => {
    activeCriterion = event.target.value;
    renderRankings();
  };
  $('#rankingSearch').oninput = renderRankings;
}

init();
