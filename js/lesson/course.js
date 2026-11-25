// Cursuslogica zonder DOM: lessen opzoeken, vergrendeling, sterren bewaren. Getest in tests/course.test.mjs.
import COURSE from '../data/course.js';

export const chapters = COURSE.chapters;
const FLAT = chapters.flatMap(c => c.lessons.map(l => ({ lesson: l, chapter: c })));

export const flat = () => FLAT;
export const findLesson = id => FLAT.find(x => x.lesson.id === id) || null;
export const passed = p => !!p && (p.status === 'skipped' || (p.stars || 0) >= 1);

/** Een les is open als de vorige les gehaald (of overgeslagen) is.
 *  Een examen is open zodra de eerste les van zijn hoofdstuk open is ("Ik ken dit al"). */
export function isUnlocked(id, prog) {
  const i = FLAT.findIndex(x => x.lesson.id === id);
  if (i < 0) return false;
  if (i === 0 || passed(prog[id])) return true;
  const { lesson, chapter } = FLAT[i];
  if (lesson.exam) {
    const first = chapter.lessons[0].id;
    if (first !== id) return isUnlocked(first, prog);
  }
  return passed(prog[FLAT[i - 1].lesson.id]);
}

export function nextLesson(id) {
  const i = FLAT.findIndex(x => x.lesson.id === id);
  return i >= 0 && FLAT[i + 1] ? FLAT[i + 1].lesson : null;
}

/** De eerste les die nog niet gehaald is maar wel open staat. */
export function firstOpen(prog) {
  const x = FLAT.find(x => !passed(prog[x.lesson.id]) && isUnlocked(x.lesson.id, prog));
  return x ? x.lesson : null;
}

export function courseStats(prog) {
  const total = FLAT.length;
  const done = FLAT.filter(x => passed(prog[x.lesson.id])).length;
  const stars = FLAT.reduce((s, x) => s + (prog[x.lesson.id]?.stars || 0), 0);
  return { total, done, pct: total ? Math.round(done / total * 100) : 0, stars, maxStars: total * 3 };
}

/** Resultaat van een les bewaren (muteert prog). Een gehaald examen geeft het hele hoofdstuk vrij. */
export function recordLesson(prog, id, { stars, acc }, date = new Date().toISOString()) {
  const x = findLesson(id);
  if (!x) return;
  const p = prog[id] || {};
  prog[id] = {
    stars: Math.max(p.stars || 0, stars),
    best: Math.max(p.best || 0, acc),
    status: stars >= 1 ? 'done' : (p.status || 'tried'),
    date,
    tries: (p.tries || 0) + 1,
  };
  if (x.lesson.exam && stars >= 1) skipChapter(prog, x.chapter.id, date);
}

/** Alle nog niet gehaalde lessen van een hoofdstuk als "overgeslagen" markeren. */
export function skipChapter(prog, chapterId, date = new Date().toISOString()) {
  const ch = chapters.find(c => c.id === chapterId);
  if (!ch) return;
  for (const l of ch.lessons) {
    if (!passed(prog[l.id])) prog[l.id] = { ...(prog[l.id] || {}), stars: prog[l.id]?.stars || 0, status: 'skipped', date };
  }
}
