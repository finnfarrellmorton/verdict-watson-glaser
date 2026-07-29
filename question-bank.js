const VERDICT_BANK_SIZE_PER_DRILL = 560;

const VERDICT_DRILLS = {
  daily: { title: 'Daily Watson Glaser test', family: 'Mixed daily test', time: '20 min' },
  mixed: { title: 'Full mixed test', family: 'Mixed Watson Glaser practice', time: '35 min' },
  inference: { title: 'Inference drill', family: 'Drawing inferences', time: '10 min' },
  assumptions: { title: 'Assumptions drill', family: 'Recognising assumptions', time: '9 min' },
  deduction: { title: 'Deduction drill', family: 'Deduction', time: '8 min' },
  interpretation: { title: 'Interpretation drill', family: 'Interpretation', time: '8 min' },
  arguments: { title: 'Arguments drill', family: 'Evaluating arguments', time: '11 min' }
};

const contexts = [
  'a City law firm reviewing vacation scheme applications',
  'a corporate team preparing for a cross-border acquisition',
  'a trainee cohort completing assessment-centre exercises',
  'a graduate recruitment team comparing test performance',
  'a disputes team reviewing evidence before a client meeting',
  'a private equity client assessing deal execution risk',
  'a banking team analysing covenant pressure',
  'a technology client reviewing regulatory exposure',
  'a competition team assessing merger clearance risk',
  'an employment team advising on restructuring plans',
  'a real estate team reviewing lease negotiations',
  'a funds team assessing investor reporting obligations',
  'a capital markets team preparing a prospectus timetable',
  'a compliance team reviewing internal controls',
  'a general counsel deciding whether to escalate a risk'
];

const evidencePoints = [
  'candidates who completed timed practice answered more questions within the limit',
  'the team found inconsistencies between witness notes and board minutes',
  'the client delayed signing until financing conditions were clarified',
  'the regulator asked for further information before approving the transaction',
  'the trainee group improved after receiving structured feedback',
  'the business reported higher compliance costs after a policy change',
  'the due diligence report identified issues in only two subsidiaries',
  'the lender requested additional reporting after missed forecasts',
  'the firm introduced a new assessment stage for all applicants',
  'the client settled after disclosure revealed a weakness in its case',
  'the board paused the project because stakeholder approval was uncertain',
  'the buyer requested warranties covering data protection and employment claims'
];

const qualifiers = [
  'the sample size was limited',
  'the report did not measure motivation',
  'the data came from one recruitment cycle',
  'the evidence did not compare every applicant',
  'the notes were incomplete',
  'the figures were unaudited',
  'the review covered only UK operations',
  'the team did not interview every stakeholder',
  'the timing of the change may have affected the result',
  'the conclusion was based on preliminary information'
];

const outcomes = [
  'higher assessment scores',
  'fewer drafting errors',
  'a shorter negotiation timetable',
  'a delay to signing',
  'more targeted interview preparation',
  'a lower risk rating',
  'a need for further due diligence',
  'stronger internal reporting',
  'a more cautious client recommendation',
  'a revised completion plan'
];

const inferenceLabels = ['True', 'Probably true', 'Insufficient data', 'Probably false', 'False'];

const rotate = (items, index) => items[index % items.length];

function placeCorrect(correct, distractors, index) {
  const answer = index % (distractors.length + 1);
  const options = [...distractors];
  options.splice(answer, 0, correct);
  return { options, answer };
}

function makeInferenceQuestion(index) {
  const context = rotate(contexts, index);
  const evidence = rotate(evidencePoints, index * 2);
  const qualifier = rotate(qualifiers, index * 3);
  const outcome = rotate(outcomes, index * 5);
  const answer = index % 5;
  const statements = [
    `The passage states that ${evidence}.`,
    `It is reasonable, though not certain, that the evidence contributed to ${outcome}.`,
    `Every applicant or client affected by the matter achieved ${outcome}.`,
    `The available evidence makes it less likely that there was no connection with ${outcome}.`,
    `The passage proves that ${evidence} did not occur.`
  ];
  const explanations = [
    'This is directly stated in the passage.',
    'The wording supports a cautious inference, but it does not prove certainty.',
    'The passage does not give enough information to support that broad claim.',
    'The evidence points against the statement, but does not make it impossible.',
    'The statement contradicts the passage.'
  ];

  return {
    id: `INF-${String(index + 1).padStart(4, '0')}`,
    family: 'Drawing inferences',
    prompt: `Read the passage, then judge the proposed inference.\n\nPassage: In ${context}, ${evidence}. However, ${qualifier}.\n\nProposed inference: ${statements[answer]}`,
    options: inferenceLabels,
    answer,
    explanation: explanations[answer]
  };
}

function makeAssumptionQuestion(index) {
  const context = rotate(contexts, index + 2);
  const outcome = rotate(outcomes, index + 7);
  const evidence = rotate(evidencePoints, index + 11);
  const assumption = rotate([
    'the observed pattern is relevant to future applicants or matters',
    'the proposed action can influence the risk being discussed',
    'students or lawyers will actually use the additional preparation time',
    'the information available is reliable enough to guide a decision',
    'the cost of the recommendation is not so high that it defeats the benefit',
    'the relevant decision-makers will consider the evidence before acting'
  ], index);

  const placed = placeCorrect(
    `That ${assumption}.`,
    [
    'That every similar matter will produce exactly the same result.',
    'That no other factor could ever affect the outcome.',
    'That the conclusion would be true even if the evidence were false.'
    ],
    index
  );

  return {
    id: `ASM-${String(index + 1).padStart(4, '0')}`,
    family: 'Recognising assumptions',
    prompt: `Argument: Because ${evidence}, ${context} should take steps aimed at achieving ${outcome}.\n\nWhich assumption does the argument make?`,
    options: placed.options,
    answer: placed.answer,
    explanation: 'The argument depends on a practical link between the evidence and the proposed action. The other options are too absolute or irrelevant.'
  };
}

function makeDeductionQuestion(index) {
  const group = rotate(['applicants', 'trainees', 'client teams', 'transactions', 'assessment answers', 'risk reports', 'practice sessions', 'case analyses'], index);
  const condition = rotate(['meet the timing standard', 'are internally consistent', 'are supported by evidence', 'identify the relevant assumption', 'distinguish fact from opinion', 'follow the stated rule', 'address the client risk', 'avoid unsupported conclusions'], index + 3);
  const subject = rotate(['Maya', 'Omar', 'Priya', 'Alex', 'Samira', 'Leo', 'Nadia', 'James', 'Aisha', 'Daniel'], index + 5);
  const placed = placeCorrect(
    `${subject}'s answer ${condition}.`,
    [
    `Every ${group.slice(0, -1)} that ${condition} receives an offer.`,
    `${subject}'s answer was the fastest answer submitted.`,
    `No answer outside this group can ${condition}.`
    ],
    index
  );

  return {
    id: `DED-${String(index + 1).padStart(4, '0')}`,
    family: 'Deduction',
    prompt: `Statements: All ${group} that pass the review ${condition}. ${subject}'s answer is one of the ${group} that passed the review.\n\nWhich conclusion follows?`,
    options: placed.options,
    answer: placed.answer,
    explanation: 'The conclusion follows because the rule applies to all members of the group that passed the review.'
  };
}

function makeInterpretationQuestion(index) {
  const context = rotate(contexts, index + 4);
  const evidence = rotate(evidencePoints, index + 8);
  const qualifier = rotate(qualifiers, index + 12);
  const outcome = rotate(outcomes, index + 16);

  const placed = placeCorrect(
    `The evidence supports a limited conclusion connected to ${outcome}, but not a universal rule.`,
    [
      'The evidence proves that the same outcome will occur in every future matter.',
      'The evidence is irrelevant because it is not perfect.',
      'The team must ignore the evidence entirely.'
    ],
    index
  );

  return {
    id: `INT-${String(index + 1).padStart(4, '0')}`,
    family: 'Interpretation',
    prompt: `Passage: In ${context}, ${evidence}. The team noted that ${qualifier}, so it avoided making a wider conclusion.\n\nWhich interpretation is most justified?`,
    options: placed.options,
    answer: placed.answer,
    explanation: 'A justified interpretation stays close to the evidence and respects the stated limitation.'
  };
}

function makeArgumentQuestion(index) {
  const issue = rotate([
    'whether applicants should complete timed Watson Glaser practice',
    'whether a client should delay signing until a regulatory point is clarified',
    'whether a trainee should review explanations after every missed question',
    'whether a buyer should request additional warranties',
    'whether a firm should track weaknesses by question family',
    'whether a legal team should escalate a compliance concern',
    'whether a student should practise inference questions separately',
    'whether a lender should ask for more financial reporting'
  ], index);
  const practicalReason = rotate([
    'it directly affects the decision being made',
    'it reduces a clearly identified risk',
    'it uses evidence from the facts rather than preference',
    'it addresses timing, cost, and likely consequences',
    'it helps the decision-maker compare realistic options',
    'it is proportionate to the risk described'
  ], index + 3);

  const placed = placeCorrect(
    `Yes, because ${practicalReason}.`,
    [
      'Yes, because it sounds more impressive to say yes.',
      'No, because some people dislike structured preparation.',
      'No, because one example somewhere might have turned out differently.'
    ],
    index
  );

  return {
    id: `ARG-${String(index + 1).padStart(4, '0')}`,
    family: 'Evaluating arguments',
    prompt: `Question: Consider ${issue}. Which is the strongest argument?`,
    options: placed.options,
    answer: placed.answer,
    explanation: 'The strongest argument is relevant, evidence-based, and connected to the practical decision.'
  };
}

function buildFamily(factory) {
  return Array.from({ length: VERDICT_BANK_SIZE_PER_DRILL }, (_, index) => factory(index));
}

function buildAllQuestions() {
  return {
    inference: buildFamily(makeInferenceQuestion),
    assumptions: buildFamily(makeAssumptionQuestion),
    deduction: buildFamily(makeDeductionQuestion),
    interpretation: buildFamily(makeInterpretationQuestion),
    arguments: buildFamily(makeArgumentQuestion)
  };
}

let verdictQuestionCache = null;

function getAllVerdictQuestions() {
  if (!verdictQuestionCache) {
    verdictQuestionCache = buildAllQuestions();
  }
  return verdictQuestionCache;
}

function getVerdictQuestions(sessionId = 'mixed') {
  const all = getAllVerdictQuestions();
  if (sessionId === 'daily') {
    const dailyLimit = window.VERDICT_DAILY_SESSION_LIMIT || 40;
    const mixedDaily = [];
    for (let index = 0; index < dailyLimit / 5; index += 1) {
      mixedDaily.push(all.inference[index], all.assumptions[index], all.deduction[index], all.interpretation[index], all.arguments[index]);
    }
    return mixedDaily.slice(0, dailyLimit);
  }
  if (sessionId === 'mixed') {
    return Object.values(all).flat().sort((a, b) => a.id.localeCompare(b.id));
  }
  return all[sessionId] || all.inference;
}

window.VERDICT_DRILLS = VERDICT_DRILLS;
window.VERDICT_BANK_SIZE_PER_DRILL = VERDICT_BANK_SIZE_PER_DRILL;
window.getVerdictQuestions = getVerdictQuestions;
