// Standaard MIDI-bestanden (type 0 en 1) inlezen, en opsplitsen in linker- en rechterhand.

export function parseMidi(input) {
  const buf = input instanceof ArrayBuffer ? input : input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength);
  const d = new DataView(buf);
  let p = 0;
  const str = n => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(d.getUint8(p + i)); p += n; return s; };
  if (d.byteLength < 14 || str(4) !== 'MThd') throw new Error('Geen geldig MIDI-bestand');
  const hl = d.getUint32(p); p += 4;
  const ntr = d.getUint16(p + 2), div = d.getUint16(p + 4);
  p += hl;
  if (div & 0x8000) throw new Error('SMPTE-timing wordt niet ondersteund');
  const tempos = [{ tick: 0, us: 500000 }], raw = [], names = [];
  for (let tr = 0; tr < ntr && p + 8 <= d.byteLength; tr++) {
    const id = str(4), len = d.getUint32(p); p += 4;
    const end = Math.min(p + len, d.byteLength);
    if (id !== 'MTrk') { p = end; continue; }
    let tick = 0, run = 0;
    const on = {};
    const vlq = () => { let v = 0, b; do { b = d.getUint8(p++); v = (v << 7) | (b & 127); } while (b & 128); return v; };
    while (p < end) {
      tick += vlq();
      let st = d.getUint8(p);
      if (st & 128) { p++; if (st < 0xf0) run = st; } else st = run;
      if (st === 0xff) {
        const ty = d.getUint8(p++), l = vlq();
        if (ty === 0x51) tempos.push({ tick, us: (d.getUint8(p) << 16) | (d.getUint8(p + 1) << 8) | d.getUint8(p + 2) });
        if (ty === 0x03) { const s0 = p; names[tr] = str(l); p = s0; }
        p += l;
      } else if (st === 0xf0 || st === 0xf7) {
        p += vlq();
      } else {
        const hi = st & 0xf0, ch = st & 15, a = d.getUint8(p++);
        let b = 0;
        if (hi !== 0xc0 && hi !== 0xd0) b = d.getUint8(p++);
        const key = ch * 128 + a;
        if (hi === 0x90 && b > 0) (on[key] = on[key] || []).push({ tick, v: b });
        else if (hi === 0x80 || (hi === 0x90 && b === 0)) {
          const s = on[key] && on[key].shift();
          if (s && ch !== 9) raw.push({ m: a, s: s.tick, e: tick, tr, ch, v: s.v / 127 });
        }
      }
    }
    p = end;
  }
  tempos.sort((x, y) => x.tick - y.tick);
  const sec = tk => {
    let s = 0, lt = 0, us = 500000;
    for (const x of tempos) { if (x.tick >= tk) break; s += (x.tick - lt) * us / div / 1e6; lt = x.tick; us = x.us; }
    return s + (tk - lt) * us / div / 1e6;
  };
  const notes = raw.filter(n => n.m >= 21 && n.m <= 108)
    .map(n => ({ m: n.m, t: sec(n.s), d: Math.max(0.08, sec(n.e) - sec(n.s)), track: n.tr, ch: n.ch, v: n.v }));
  if (!notes.length) throw new Error('Geen noten gevonden');
  const t0 = Math.min(...notes.map(n => n.t));
  notes.forEach(n => (n.t -= t0));
  notes.sort((a, b) => a.t - b.t || a.m - b.m);
  return { notes, tracks: names };
}

/** Geef elke noot een hand: per spoor/kanaal als er duidelijk een hoge en een lage partij is,
 *  anders splitsen rond de centrale C (C4 en hoger = rechts). */
export function splitHands(notes) {
  const groups = new Map();
  for (const n of notes) {
    const k = `${n.track ?? 0}:${n.ch ?? 0}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(n);
  }
  if (groups.size >= 2) {
    const st = [...groups].map(([k, ns]) => ({ k, avg: ns.reduce((s, n) => s + n.m, 0) / ns.length }))
      .sort((a, b) => b.avg - a.avg);
    const hiAvg = st[0].avg, loAvg = st[st.length - 1].avg;
    if (hiAvg - loAvg >= 5) {
      const map = {};
      for (const g of st) map[g.k] = (hiAvg - g.avg) <= (g.avg - loAvg) ? 'rh' : 'lh';
      return notes.map(n => ({ ...n, hand: map[`${n.track ?? 0}:${n.ch ?? 0}`] }));
    }
  }
  return notes.map(n => ({ ...n, hand: n.m >= 60 ? 'rh' : 'lh' }));
}

export function loadMidiFile(buf) {
  return splitHands(parseMidi(buf).notes);
}
