export const cohort = {
  code: "COHORT-001",
  label: "Founding Cohort",
  startLong: "September 8, 2026",
  endLong: "October 6, 2026",
  shortRange: "Sep 8 to Oct 6, 2026",
  passScore: 90,
  totalDays: 21,
} as const;

const cohortStartUtc = Date.UTC(2026, 8, 8);

export function lessonDate(day: number) {
  const date = new Date(cohortStartUtc);
  let studyDay = 1;

  while (studyDay < day) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) studyDay += 1;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
