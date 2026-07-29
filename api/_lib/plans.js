const PLANS = {
  daily: {
    key: 'daily',
    name: 'Daily Practice',
    stripePriceEnv: 'STRIPE_PRICE_DAILY',
    mode: 'subscription',
    entitlement: 'daily'
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    stripePriceEnv: 'STRIPE_PRICE_PRO',
    mode: 'subscription',
    entitlement: 'full_practice'
  },
  institution: {
    key: 'institution',
    name: 'Institution',
    stripePriceEnv: 'STRIPE_PRICE_INSTITUTION',
    mode: 'subscription',
    entitlement: 'cohort_practice'
  },
  lifetime: {
    key: 'lifetime',
    name: 'Lifetime Access',
    stripePriceEnv: 'STRIPE_PRICE_LIFETIME',
    mode: 'payment',
    entitlement: 'lifetime'
  }
};

function getPlan(planKey) {
  return PLANS[planKey] || null;
}

function getPriceId(plan) {
  return process.env[plan.stripePriceEnv];
}

module.exports = { PLANS, getPlan, getPriceId };
