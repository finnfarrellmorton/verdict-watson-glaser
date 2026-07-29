const { readRawBody, sendJson } = require('./_lib/http');
const { getStripe } = require('./_lib/stripe');
const { getSupabaseAdmin } = require('./_lib/supabase');

async function upsertCustomerAndSubscription(sessionOrSubscription, fallbackPlan) {
  const supabase = getSupabaseAdmin();
  const customerId = typeof sessionOrSubscription.customer === 'string'
    ? sessionOrSubscription.customer
    : sessionOrSubscription.customer?.id;
  const subscriptionId = typeof sessionOrSubscription.subscription === 'string'
    ? sessionOrSubscription.subscription
    : sessionOrSubscription.id?.startsWith?.('sub_')
      ? sessionOrSubscription.id
      : null;

  const email = sessionOrSubscription.customer_details?.email || sessionOrSubscription.customer_email || null;
  const plan = sessionOrSubscription.metadata?.verdictPlan || fallbackPlan || 'daily';
  const status = sessionOrSubscription.status || 'active';

  if (customerId || email) {
    await supabase.from('billing_customers').upsert({
      stripe_customer_id: customerId,
      email,
      updated_at: new Date().toISOString()
    }, { onConflict: 'stripe_customer_id' });
  }

  if (subscriptionId || sessionOrSubscription.mode === 'payment') {
    await supabase.from('subscriptions').upsert({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId || `lifetime_${sessionOrSubscription.id}`,
      plan,
      status: sessionOrSubscription.mode === 'payment' ? 'active' : status,
      current_period_end: sessionOrSubscription.current_period_end
        ? new Date(sessionOrSubscription.current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'stripe_subscription_id' });
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const stripe = getStripe();
    const signature = req.headers['stripe-signature'];
    const rawBody = await readRawBody(req);

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return sendJson(res, 503, { error: 'Missing STRIPE_WEBHOOK_SECRET' });
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      await upsertCustomerAndSubscription(event.data.object);
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      await upsertCustomerAndSubscription(event.data.object);
    }

    if (event.type === 'invoice.paid') {
      const invoice = event.data.object;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        await upsertCustomerAndSubscription(subscription);
      }
    }

    return sendJson(res, 200, { received: true });
  } catch (error) {
    return sendJson(res, 400, { error: error.message || 'Webhook failed' });
  }
};
