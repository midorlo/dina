export function timeAgo(dateStr: string): string {
  const rtf = new Intl.RelativeTimeFormat('de', { numeric: 'auto' });
  const diff = (new Date(dateStr).getTime() - Date.now()) / 1000;
  const times = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'week', seconds: 60 * 60 * 24 * 7 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ];
  for (const t of times) {
    if (Math.abs(diff) >= t.seconds) {
      return rtf.format(Math.round(diff / t.seconds), t.unit as Intl.RelativeTimeFormatUnit);
    }
  }
  return rtf.format(0, 'second');
}
