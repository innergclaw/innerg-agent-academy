alter table public.profiles
  add column if not exists scholar_role text,
  add column if not exists primary_focus text,
  add column if not exists experience_level text not null default 'explorer',
  add column if not exists capstone_goal text,
  add column if not exists weekly_commitment text not null default 'focused',
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_completed_at timestamptz;

alter table public.profiles
  drop constraint if exists profiles_scholar_role_check,
  drop constraint if exists profiles_experience_level_check,
  drop constraint if exists profiles_capstone_goal_check,
  drop constraint if exists profiles_weekly_commitment_check;

alter table public.profiles
  add constraint profiles_scholar_role_check
    check (scholar_role in ('founder', 'creative', 'educator', 'professional', 'student', 'builder')),
  add constraint profiles_experience_level_check
    check (experience_level in ('explorer', 'operator', 'builder')),
  add constraint profiles_capstone_goal_check
    check (char_length(capstone_goal) <= 420),
  add constraint profiles_weekly_commitment_check
    check (weekly_commitment in ('steady', 'focused', 'intensive'));

drop policy if exists "Learners can create their own profile" on public.profiles;
create policy "Learners can create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id and role = 'learner');
