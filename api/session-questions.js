const { sendJson } = require('./_lib/http');
const { getUserFromRequest, getSupabaseAdmin } = require('./_lib/supabase');

function canAccess(sessionId, plan) {
  if (plan === 'daily') return sessionId === 'daily';
  if (plan === 'free') return sessionId === 'daily';
  return ['daily', 'mixed', 'inference', 'assumptions', 'deduction', 'interpretation', 'arguments'].includes(sessionId);
}

async function getPlanForUser(user) {
  if (!user) return 'daily';
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from('subscriptions')
    .select('plan,status')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing']);

  if ((data || []).some(row => row.plan === 'lifetime')) return 'lifetime';
  if ((data || []).some(row => row.plan === 'institution')) return 'institution';
  if ((data || []).some(row => row.plan === 'pro')) return 'pro';
  if ((data || []).some(row => row.plan === 'unlimited')) return 'unlimited';
  return 'daily';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host}`);
    const sessionId = url.searchParams.get('session') || 'daily';
    const user = await getUserFromRequest(req);
    const plan = await getPlanForUser(user);

    if (!canAccess(sessionId, plan)) {
      return sendJson(res, 403, {
        error: 'Plan does not include this session',
        plan,
        allowedSession: 'daily'
      });
    }

    return sendJson(res, 200, {
      session: sessionId,
      plan,
      message: 'Protected question delivery is wired. Move authored question records from question-bank.js into Supabase before launch.'
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Could not load session' });
  }
};
