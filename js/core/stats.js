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
