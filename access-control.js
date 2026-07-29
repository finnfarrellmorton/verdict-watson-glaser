const VERDICT_PLANS = {
  daily: {
    name: 'Daily Practice',
    allowance: '1 limited mixed test available today',
    access: 'Daily Watson Glaser test only',
    cta: 'Upgrade to unlock focused drills'
  },
  pro: {
    name: 'Pro',
    allowance: 'Unlimited tests and specialised drills',
    access: 'Full question bank + all focused drills',
    cta: 'All practice modes unlocked'
  },
  institution: {
    name: 'Institution',
    allowance: 'Cohort access with full practice',
    access: 'Full question bank + cohort administration',
    cta: 'Institution access active'
  },
  lifetime: {
    name: 'Lifetime Access',
    allowance: 'Unlimited forever',
    access: 'Permanent full bank access',
    cta: 'All practice modes unlocked forever'
  }
};

const VERDICT_DAILY_SESSION_LIMIT = 40;

function safeStorageGet(key) {
  try {
    return window.localStorage?.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // Storage can be blocked in private browsing or embedded webviews.
  }
}

function getVerdictPlan() {
  const saved = safeStorageGet('verdict-plan') || 'daily';
  if (saved === 'unlimited') return 'pro';
  return VERDICT_PLANS[saved] ? saved : 'daily';
}

function setVerdictPlan(plan) {
  if (!VERDICT_PLANS[plan]) return;
  safeStorageSet('verdict-plan', plan);
}

function canAccessVerdictSession(sessionId, plan = getVerdictPlan()) {
  if (plan === 'daily') return sessionId === 'daily';
  return true;
}

function getVerdictStartSession(plan = getVerdictPlan()) {
  return plan === 'daily' ? 'daily' : 'mixed';
}

window.VERDICT_PLANS = VERDICT_PLANS;
window.VERDICT_DAILY_SESSION_LIMIT = VERDICT_DAILY_SESSION_LIMIT;
window.getVerdictPlan = getVerdictPlan;
window.setVerdictPlan = setVerdictPlan;
window.canAccessVerdictSession = canAccessVerdictSession;
window.getVerdictStartSession = getVerdictStartSession;
