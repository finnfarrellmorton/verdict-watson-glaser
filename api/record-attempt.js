const { sendJson, readJson } = require('./_lib/http');
const { getSupabaseAdmin, getUserFromRequest } = require('./_lib/supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromRequest(req);
    if (!user) return sendJson(res, 401, { error: 'Sign in required' });

    const payload = await readJson(req);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('test_attempts').insert({
      user_id: user.id,
      session_type: payload.sessionType,
      total_questions: payload.totalQuestions,
      answered_questions: payload.answeredQuestions,
      correct_answers: payload.correctAnswers,
      accuracy: payload.accuracy,
      duration_seconds: payload.durationSeconds,
      domain_breakdown: payload.breakdown || {},
      status: 'submitted',
      submitted_at: new Date().toISOString()
    });

    if (error) throw error;
    return sendJson(res, 200, { saved: true });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Could not record attempt' });
  }
};
