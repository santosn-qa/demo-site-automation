/**
 * Normalizes a date string so it matches the exact formatting DemoQA uses in the
 * Student Registration confirmation modal.
 *
 * Why this exists:
 * - The test data fixture uses a compact format like "7 Feb 1990".
 * - The confirmation modal renders "07 February,1990" (zero-padded day,
 *   full month name, and a comma directly before the year).
 *
 * This helper keeps formatting rules in one place so tests can focus on intent
 * ("DOB is correct") rather than UI-specific string quirks.
 */
export function formatDateForDemoQaModal(input: string): string {
  const parts = input.trim().split(/\s+/);
  if (parts.length !== 3) {
    // If the input isn't in the expected "D Mon YYYY" shape, fall back to the
    // original value so callers can still assert or debug the raw string.
    return input;
  }

  const [day, month, year] = parts;

  const monthMap: Record<string, string> = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December'
  };

  const normalizedDay = day.padStart(2, '0');
  const normalizedMonth = monthMap[month] ?? month;

  return `${normalizedDay} ${normalizedMonth},${year}`;
}

/**
 * Joins multiple UI values using the separator DemoQA displays in summary tables.
 *
 * Example: ["Maths", "Physics"] -> "Maths, Physics"
 */
export function joinValues(values: string[]): string {
  return values.join(', ');
}
