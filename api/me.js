const { sendJson } = require('./_lib/http');
const { getSupabaseAdmin, getUserFromRequest } = require('./_lib/supabase');

function bestPlanFromSubscriptions(subscriptions) {
  const active = subscriptions.filter(row => ['active', 'trialing'].includes(row.status));
  if (active.some(row => row.plan === 'lifetime')) return 'lifetime';
  if (active.some(row => row.plan === 'institution')) return 'institution';
  if (active.some(row => row.plan === 'pro')) return 'pro';
  if (active.some(row => row.plan === 'unlimited')) return 'unlimited';
  if (active.some(row => row.plan === 'daily')) return 'daily';
  return 'daily';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return sendJson(res, 200, {
        authenticated: false,
        plan: 'daily',
        note: 'Unauthenticated users receive demo daily access only.'
      });
    }

    const supabase = getSupabaseAdmin();
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('plan,status,current_period_end')
      .eq('user_id', user.id);

    if (error) throw error;

    return sendJson(res, 200, {
      authenticated: true,
      user: { id: user.id, email: user.email },
      plan: bestPlanFromSubscriptions(subscriptions || []),
      subscriptions: subscriptions || []
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Could not load user' });
  }
};
