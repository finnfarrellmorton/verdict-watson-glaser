create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  display_name text,
  university text,
  degree_subject text,
  study_year text,
  target_sector text,
  target_assessment_date date,
  timezone text default 'UTC',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  default_question_count integer default 10,
  default_timed_mode boolean default false,
  preferred_session_minutes integer default 20,
  weekly_question_goal integer default 40,
  weekly_minute_goal integer default 120,
  email_reminders_enabled boolean default true,
  weekly_summary_enabled boolean default true,
  reduced_motion boolean default false,
  theme text default 'system',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('student', 'content_reviewer', 'administrator', 'institution_manager')),
  granted_by uuid references public.profiles(id),
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

create table if not exists public.questions (
  id text primary key,
  domain text not null,
  question_type text not null default 'multiple_choice',
  passage text,
  prompt text not null,
  answer_format text not null default 'single_choice',
  options_json jsonb not null,
  correct_answer_json jsonb not null,
  short_explanation text,
  full_explanation text,
  reasoning_rule text,
  common_trap text,
  difficulty text default 'standard',
  estimated_seconds integer,
  source_type text default 'original',
  source_reference text,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'changes_requested', 'approved', 'published', 'archived')),
  current_version integer not null default 1,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.test_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mode text not null,
  status text not null default 'created' check (status in ('created', 'in_progress', 'submitted', 'auto_submitted', 'abandoned', 'invalidated')),
  started_at timestamptz,
  expires_at timestamptz,
  submitted_at timestamptz,
  server_elapsed_seconds integer,
  score_correct integer,
  score_total integer,
  answered_count integer,
  unanswered_count integer,
  settings_snapshot_json jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.user_roles enable row level security;
alter table public.questions enable row level security;
alter table public.test_attempts enable row level security;

create policy "profiles_self_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);
create policy "preferences_self_all" on public.user_preferences for all using (auth.uid() = user_id);
create policy "attempts_self_all" on public.test_attempts for all using (auth.uid() = user_id);
create policy "published_questions_select" on public.questions for select using (status = 'published');
