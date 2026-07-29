const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);

for (const file of ['legal-cheek-profile-facts.js', 'law-firms.js', 'question-bank.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx);
}

const failures = [];
const firms = ctx.window.LAW_FIRMS || [];
const slugs = new Set();

for (const firm of firms) {
  if (!firm.slug) failures.push(`Firm missing slug: ${firm.name}`);
  if (slugs.has(firm.slug)) failures.push(`Duplicate firm slug: ${firm.slug}`);
  slugs.add(firm.slug);
  for (const metric of ['prestige', 'training', 'pay', 'work', 'balance', 'international']) {
    if (typeof firm[metric] !== 'number' || firm[metric] < 0 || firm[metric] > 100) {
      failures.push(`${firm.name} has invalid ${metric}: ${firm[metric]}`);
    }
  }
  if (!firm.sources?.length) failures.push(`${firm.name} has no sources`);
}

const questionIds = new Set();
for (const session of ['inference', 'assumptions', 'deduction', 'interpretation', 'arguments']) {
  const questions = ctx.window.getVerdictQuestions(session);
  if (!questions.length) failures.push(`${session} has no questions`);
  for (const question of questions) {
    if (questionIds.has(question.id)) {
      failures.push(`Duplicate question id: ${question.id}`);
    }
    questionIds.add(question.id);
    if (!question.options || question.answer < 0 || question.answer >= question.options.length) {
      failures.push(`${question.id} has invalid answer index`);
    }
  }
}

for (const session of ['daily', 'mixed']) {
  const questions = ctx.window.getVerdictQuestions(session);
  if (!questions.length) failures.push(`${session} has no questions`);
  for (const question of questions) {
    if (!questionIds.has(question.id)) {
      failures.push(`${session} references unknown question id: ${question.id}`);
    }
  }
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.slice(0, 50).forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${firms.length} firms and ${questionIds.size} unique questions.`);
