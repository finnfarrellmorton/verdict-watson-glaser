-- Verdict production schema for Supabase Postgres.
-- Run in the Supabase SQL editor before connecting authenticated production traffic.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'student' check (role in ('student', 'reviewer', 'admin')),
  target_sector text,
  target_assessment_date date,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  daily_question_target integer not null default 10 check (daily_question_target between 1 and 100),
  feedback_timing text not null default 'immediate' check (feedback_timing in ('immediate', 'end')),
  email_reminders boolean not null default false,
  product_emails boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  domain text not null check (domain in ('inference', 'assumptions', 'deduction', 'interpretation', 'arguments')),
  prompt text not null,
  options jsonb not null,
  correct_answer_index integer not null,
  explanation text not null,
  difficulty text not null default 'standard' check (difficulty in ('foundational', 'standard', 'advanced')),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'changes_requested', 'approved', 'published', 'archived')),
  author_id uuid references public.profiles(id) on delete set null,
  reviewer_id uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint questions_answer_in_range check (correct_answer_index >= 0 and correct_answer_index < jsonb_array_length(options))
);

create index if not exists questions_domain_status_idx on public.questions(domain, status);
create index if not exists questions_difficulty_idx on public.questions(difficulty);

create table if not exists public.question_tags (
  question_id uuid references public.questions(id) on delete cascade,
  tag text not null,
  primary key (question_id, tag)
);

create table if not exists public.question_versions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  changed_by uuid references public.profiles(id) on delete set null,
  change_note text,
  created_at timestamptz not null default now(),
  unique (question_id, version_number)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('inference', 'assumptions', 'deduction', 'interpretation', 'arguments')),
  title text not null,
  summary text not null,
  body jsonb not null default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  mode text not null check (mode in ('diagnostic', 'domain_drill', 'mixed_practice', 'mini_mock', 'full_mock', 'review')),
  question_count integer not null,
  duration_seconds integer,
  domain_distribution jsonb not null default '{}'::jsonb,
  feedback_policy text not null default 'after_submission',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.test_templates(id) on delete set null,
  session_type text not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  submitted_at timestamptz,
  total_questions integer not null default 0,
  answered_questions integer not null default 0,
  correct_answers integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  duration_seconds integer not null default 0,
  domain_breakdown jsonb not null default '{}'::jsonb,
  status text not null default 'in_progress' check (status in ('in_progress', 'submitted', 'abandoned', 'expired')),
  created_at timestamptz not null default now()
);

create index if not exists test_attempts_user_created_idx on public.test_attempts(user_id, created_at desc);

create table if not exists public.attempt_questions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.test_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete restrict,
  question_version_id uuid references public.question_versions(id) on delete restrict,
  position integer not null,
  prompt_snapshot text not null,
  options_snapshot jsonb not null,
  correct_answer_index_snapshot integer not null,
  explanation_snapshot text not null,
  created_at timestamptz not null default now(),
  unique (attempt_id, position)
);

create table if not exists public.attempt_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_question_id uuid not null references public.attempt_questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  selected_answer_index integer,
  is_correct boolean not null default false,
  confidence integer check (confidence between 1 and 3),
  response_time_seconds integer not null default 0,
  flagged_for_review boolean not null default false,
  answered_at timestamptz not null default now()
);

create index if not exists attempt_responses_user_idx on public.attempt_responses(user_id, answered_at desc);

create table if not exists public.domain_progress (
  user_id uuid references public.profiles(id) on delete cascade,
  domain text not null check (domain in ('inference', 'assumptions', 'deduction', 'interpretation', 'arguments')),
  attempted_count integer not null default 0,
  correct_count integer not null default 0,
  mastery_score numeric(5,2) not null default 0,
  average_response_time_seconds numeric(8,2) not null default 0,
  high_confidence_misses integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, domain)
);

create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  domain text not null,
  review_state text not null default 'due' check (review_state in ('due', 'learning', 'cleared', 'snoozed')),
  reason text not null,
  scheduled_for timestamptz not null,
  last_reviewed_at timestamptz,
  review_count integer not null default 0,
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 1,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create index if not exists review_items_due_idx on public.review_items(user_id, review_state, scheduled_for);

create table if not exists public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  target_date date,
  weekly_minutes integer not null,
  priority_domains jsonb not null default '[]'::jsonb,
  plan jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  question_id uuid not null references public.questions(id) on delete cascade,
  feedback_type text not null check (feedback_type in ('unclear', 'dispute_answer', 'typo', 'accessibility', 'other')),
  body text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  plan text not null check (plan in ('daily', 'pro', 'institution', 'lifetime')),
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.entitlement_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  entitlement text not null,
  source text not null check (source in ('subscription', 'institution', 'manual', 'trial')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  domain text not null,
  draft_payload jsonb not null,
  status text not null default 'ai_draft' check (status in ('ai_draft', 'submitted_for_review', 'rejected', 'converted')),
  created_at timestamptz not null default now()
);

create table if not exists public.ai_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.questions(id) on delete cascade,
  draft_id uuid references public.ai_drafts(id) on delete cascade,
  result jsonb not null,
  model text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('reviewer', 'admin'));
$$;

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.questions enable row level security;
alter table public.question_tags enable row level security;
alter table public.question_versions enable row level security;
alter table public.lessons enable row level security;
alter table public.test_templates enable row level security;
alter table public.test_attempts enable row level security;
alter table public.attempt_questions enable row level security;
alter table public.attempt_responses enable row level security;
alter table public.domain_progress enable row level security;
alter table public.review_items enable row level security;
alter table public.study_plans enable row level security;
alter table public.question_feedback enable row level security;
alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.entitlement_grants enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.ai_drafts enable row level security;
alter table public.ai_quality_reviews enable row level security;

create policy "profiles_select_own_or_admin" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own_or_admin" on public.profiles for update using (auth.uid() = id or public.is_admin());

create policy "preferences_own" on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "published_questions_readable" on public.questions for select using (status = 'published' or public.is_reviewer());
create policy "reviewers_manage_questions" on public.questions for all using (public.is_reviewer()) with check (public.is_reviewer());
create policy "published_tags_readable" on public.question_tags for select using (true);
create policy "reviewers_manage_tags" on public.question_tags for all using (public.is_reviewer()) with check (public.is_reviewer());
create policy "reviewers_read_versions" on public.question_versions for select using (public.is_reviewer());
create policy "reviewers_manage_versions" on public.question_versions for insert with check (public.is_reviewer());

create policy "published_lessons_readable" on public.lessons for select using (status = 'published' or public.is_reviewer());
create policy "reviewers_manage_lessons" on public.lessons for all using (public.is_reviewer()) with check (public.is_reviewer());
create policy "active_templates_readable" on public.test_templates for select using (active = true or public.is_reviewer());
create policy "admins_manage_templates" on public.test_templates for all using (public.is_admin()) with check (public.is_admin());

create policy "attempts_own" on public.test_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "attempt_questions_own" on public.attempt_questions for select using (
  exists (select 1 from public.test_attempts ta where ta.id = attempt_questions.attempt_id and ta.user_id = auth.uid())
);
create policy "attempt_questions_insert_own" on public.attempt_questions for insert with check (
  exists (select 1 from public.test_attempts ta where ta.id = attempt_questions.attempt_id and ta.user_id = auth.uid())
);
create policy "responses_own" on public.attempt_responses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "domain_progress_own" on public.domain_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "review_items_own" on public.review_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "study_plans_own" on public.study_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "feedback_insert_own" on public.question_feedback for insert with check (auth.uid() = user_id);
create policy "feedback_read_own_or_reviewer" on public.question_feedback for select using (auth.uid() = user_id or public.is_reviewer());
create policy "reviewers_manage_feedback" on public.question_feedback for update using (public.is_reviewer());

create policy "billing_own_or_admin" on public.billing_customers for select using (auth.uid() = user_id or public.is_admin());
create policy "subscriptions_own_or_admin" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin());
create policy "entitlements_own_or_admin" on public.entitlement_grants for select using (auth.uid() = user_id or public.is_admin());
create policy "admins_manage_entitlements" on public.entitlement_grants for all using (public.is_admin()) with check (public.is_admin());

create policy "admins_read_audit" on public.admin_audit_logs for select using (public.is_admin());
create policy "admins_insert_audit" on public.admin_audit_logs for insert with check (public.is_admin());
create policy "reviewers_manage_ai_drafts" on public.ai_drafts for all using (public.is_reviewer()) with check (public.is_reviewer());
create policy "reviewers_manage_ai_quality" on public.ai_quality_reviews for all using (public.is_reviewer()) with check (public.is_reviewer());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();

  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
