-- Scholars and facilitators may maintain their own onboarding profile.
-- The protected role and cohort fields remain non-editable from the browser.
revoke update on table public.profiles from authenticated;

grant update (
  id,
  full_name,
  scholar_role,
  primary_focus,
  experience_level,
  capstone_goal,
  weekly_commitment,
  onboarding_completed,
  onboarding_completed_at,
  updated_at
) on table public.profiles to authenticated;

drop policy if exists "Learners can update their own profile" on public.profiles;

create policy "Members can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
