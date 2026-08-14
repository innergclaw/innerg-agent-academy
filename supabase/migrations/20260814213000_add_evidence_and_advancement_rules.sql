alter table public.lesson_progress
  add column if not exists evidence_text text,
  add column if not exists attempts integer not null default 0;

alter table public.lesson_progress
  drop constraint if exists lesson_progress_evidence_text_length,
  add constraint lesson_progress_evidence_text_length
    check (evidence_text is null or char_length(evidence_text) <= 2000),
  drop constraint if exists lesson_progress_attempts_nonnegative,
  add constraint lesson_progress_attempts_nonnegative
    check (attempts >= 0);

create or replace function private.enforce_academy_advancement()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'completed' then
    if new.evidence_text is null or char_length(trim(new.evidence_text)) < 30 then
      raise exception 'Mission evidence must contain at least 30 characters.'
        using errcode = 'check_violation';
    end if;

    if new.lesson_day in (7, 14, 21) and coalesce(new.score, 0) < 90 then
      raise exception 'A checkpoint score of 90 percent or higher is required to advance.'
        using errcode = 'check_violation';
    end if;

    if new.lesson_day > 1 and not exists (
      select 1
      from public.lesson_progress previous
      where previous.user_id = new.user_id
        and previous.lesson_day = new.lesson_day - 1
        and previous.status = 'completed'
    ) then
      raise exception 'Complete the previous mission before advancing.'
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_academy_advancement() from public, anon, authenticated;

drop trigger if exists enforce_academy_advancement on public.lesson_progress;
create trigger enforce_academy_advancement
  before insert or update on public.lesson_progress
  for each row execute procedure private.enforce_academy_advancement();
