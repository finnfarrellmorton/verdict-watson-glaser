const { sendJson, readJson } = require('./_lib/http');
const { getStripe } = require('./_lib/stripe');
const { getPlan, getPriceId } = require('./_lib/plans');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const { plan: planKey, email, referralCode } = await readJson(req);
    const plan = getPlan(planKey);
    if (!plan) return sendJson(res, 400, { error: 'Unknown plan' });

    const priceId = getPriceId(plan);
    if (!priceId) {
      return sendJson(res, 503, {
        error: `Stripe price is not configured for ${plan.name}. Add ${plan.stripePriceEnv} to your environment.`
      });
    }

    const stripe = getStripe();
    const baseUrl = process.env.APP_BASE_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: plan.mode,
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${baseUrl}/index.html?checkout=success&plan=${encodeURIComponent(plan.key)}`,
      cancel_url: `${baseUrl}/index.html?view=plans&checkout=cancelled`,
      metadata: {
        verdictPlan: plan.key,
        referralCode: referralCode || ''
      },
      subscription_data: plan.mode === 'subscription' ? {
        metadata: {
          verdictPlan: plan.key,
          referralCode: referralCode || ''
        }
      } : undefined,
      payment_intent_data: plan.mode === 'payment' ? {
        metadata: {
          verdictPlan: plan.key,
          referralCode: referralCode || ''
        }
      } : undefined
    });

    return sendJson(res, 200, { url: session.url });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Could not create checkout session' });
  }
};
