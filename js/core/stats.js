// Pure hulpfuncties voor oefentijd en streak (getest in tests/stats.test.mjs).

export function dayKey(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

/** Seconden geoefend in de laatste 7 dagen (vandaag inbegrepen). */
export function weekSeconds(practice, today = new Date()) {
  let s = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    s += practice[dayKey(d)] || 0;
  }
  return s;
}

/** Aantal opeenvolgende dagen met minstens `min` seconden oefening.
 *  Als er vandaag nog niet geoefend is, telt de reeks tot gisteren (ze is nog niet gebroken). */
export function streakDays(practice, today = new Date(), min = 60) {
  let n = 0;
  const d = new Date(today);
  if ((practice[dayKey(d)] || 0) < min) d.setDate(d.getDate() - 1);
  while ((practice[dayKey(d)] || 0) >= min) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Langste reeks ooit (dagen met minstens `min` seconden). */
export function longestStreak(practice, min = 60) {
  const days = Object.keys(practice).filter(k => practice[k] >= min).sort();
  let best = 0, run = 0, prev = null;
  for (const k of days) {
    const d = new Date(k + 'T12:00:00');
    run = prev && Math.round((d - prev) / 864e5) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}

export const totalSeconds = practice => Object.values(practice).reduce((s, v) => s + (v || 0), 0);

/** De laatste `weeks` weken als rijen van 7 dagen (maandag eerst): [{key, sec, future}]. */
export function heatmap(practice, today = new Date(), weeks = 4) {
  const end = new Date(today);
  end.setDate(end.getDate() + (7 - ((end.getDay() + 6) % 7) - 1)); // zondag van deze week
  const out = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const row = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - w * 7 - i);
      row.push({ key: dayKey(d), sec: practice[dayKey(d)] || 0, future: d > today });
    }
    out.push(row);
  }
  return out;
}

export function median(xs) {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
