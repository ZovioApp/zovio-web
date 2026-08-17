/**
 * Suggested IANA timezone names, shown via <datalist> on timezone inputs.
 * Not exhaustive — free text is still accepted — but covers Zovio's current
 * markets so the common path doesn't produce a typo that later breaks the
 * backend's reminder cron (it runs every academy's timezone through
 * Intl.DateTimeFormat with no error handling).
 */
export const TIMEZONE_SUGGESTIONS = [
  'Asia/Colombo',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
];

/** True if the runtime's Intl implementation recognizes `tz` as a timezone. */
export function isValidTimezone(tz: string): boolean {
  if (!tz) return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
