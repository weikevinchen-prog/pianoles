// Screenshots voor visuele controle (iPhone liggend, 844×390), met alle lessen vrijgegeven.
// Gebruik:  node tests/shots.mjs <uitvoermap> "#/les/h2-l1" "#/les/h2-l3|click:#lCtl button" …
// Na '|' volgen acties gescheiden door '|': click:<selector>, note:<midi>, wait:<ms>, js:<code>.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [out, ...pages] = process.argv.slice(2);
if (!out || !pages.length) { console.error('Gebruik: node tests/shots.mjs <map> "#/route|acties" …'); process.exit(2); }
mkdirSync(out, { recursive: true });
const PORT = 8125, DBG = 9334, W = +(process.env.W || 844), H = +(process.env.H || 390);
const CHROME = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find(p => p && existsSync(p));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const server = spawn(process.platform === 'win32' ? 'python' : 'python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
const profile = mkdtempSync(join(tmpdir(), 'pianoles-shots-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${profile}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async e => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result?.value;

try {
  let target;
  for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${DBG}/json/list`)).json()).find(t => t.type === 'page'); } catch (e) { /* */ } }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result); pending.delete(d.id); } });
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: false });
  await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
  for (let i = 0; i < 40 && !(await ev('!!window.pianoles')); i++) await sleep(150);
  await ev(`import('./js/lesson/course.js').then(c=>pianoles.store.update(s=>{for(const x of c.flat())s.lessons[x.lesson.id]={stars:1,status:'done'}}))`);
  for (const spec of pages) {
    const [hash, ...acts] = spec.split('|');
    await ev(`location.hash='#/';`);
    await sleep(100);
    await ev(`location.hash='${hash}'`);
    await sleep(700);
    for (const a of acts) {
      const [k, v] = [a.slice(0, a.indexOf(':')), a.slice(a.indexOf(':') + 1)];
      if (k === 'click') await ev(`document.querySelector(${JSON.stringify(v)})?.click()`);
      if (k === 'note') await ev(`pianoles.input.noteOn(${v},.8,'midi');pianoles.input.noteOff(${v},'midi')`);
      if (k === 'wait') await sleep(+v);
      if (k === 'js') await ev(`{${v}}`);
      await sleep(250);
    }
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const file = join(out, spec.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 60) + '.png');
    writeFileSync(file, Buffer.from(shot.data, 'base64'));
    console.log(file);
  }
} finally {
  try { ws?.close(); } catch (e) { /* */ }
  chrome.kill(); server.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* */ }
}
