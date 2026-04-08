export function formatDateForDemoQaModal(input: string): string {
  const parts = input.trim().split(/\s+/);
  if (parts.length !== 3) {
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

export function joinValues(values: string[]): string {
  return values.join(', ');
}
