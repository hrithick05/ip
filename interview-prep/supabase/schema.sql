create extension if not exists pgcrypto;

create table if not exists coding_questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  difficulty text default 'Easy',
  description text,
  input_data text default '',
  expected_output text default ''
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  question_id uuid references coding_questions(id),
  code text,
  status text,
  created_at timestamptz default now()
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  question_text text,
  option1 text,
  option2 text,
  option3 text,
  option4 text,
  correct_answer text,
  field text,
  category text
);

create table if not exists interview_submissions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  field text,
  category text,
  score int,
  created_at timestamptz default now()
);

create table if not exists hr_answers (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  question_id uuid references questions(id),
  answer_text text,
  created_at timestamptz default now()
);
