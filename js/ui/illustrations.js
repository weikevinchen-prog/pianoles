// Eenvoudige lijntekeningen voor de houdingskaartjes. Lijnen in currentColor, accenten in goud.
import { bothHandsSVG } from './hands.js';

const G = '#f2b84b';
const wrap = (body, label) => `<svg class="illus-svg" viewBox="0 0 320 200" role="img" aria-label="${label}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

export const ILLUSTRATIONS = {
  zithoogte: () => wrap(`
    <line x1="10" y1="190" x2="310" y2="190"/>
    <rect x="205" y="96" width="105" height="14" rx="3"/>
    <rect x="252" y="36" width="58" height="60"/>
    <line x1="222" y1="110" x2="222" y2="190"/><line x1="298" y1="110" x2="298" y2="190"/>
    <rect x="66" y="130" width="84" height="12" rx="3"/>
    <line x1="78" y1="142" x2="78" y2="190"/><line x1="138" y1="142" x2="138" y2="190"/>
    <circle cx="106" cy="36" r="16"/>
    <path d="M108 52 L112 128"/>
    <path d="M110 64 L130 98"/>
    <path d="M130 98 L214 96" />
    <path d="M112 128 L176 128 L182 188"/>
    <line x1="120" y1="96" x2="236" y2="96" stroke="${G}" stroke-width="2" stroke-dasharray="6 6"/>`, 'Zithouding aan de piano, zijaanzicht'),

  'ronde-vingers': () => wrap(`
    <rect x="20" y="150" width="280" height="22" rx="3"/>
    <circle cx="168" cy="110" r="36" stroke="${G}" stroke-width="2" stroke-dasharray="6 6"/>
    <path d="M18 96 L112 96" stroke-width="16"/>
    <path d="M112 96 Q150 64 192 76 Q216 86 216 118 L210 148" stroke-width="12"/>
    <path d="M132 104 L150 132" stroke-width="9"/>
    <text x="168" y="114" fill="${G}" stroke="none" font-size="13" font-weight="700" text-anchor="middle" font-family="Manrope,sans-serif">bal</text>
    <text x="246" y="140" fill="${G}" stroke="none" font-size="13" font-weight="700" font-family="Manrope,sans-serif">vingertop</text>`, 'Ronde vingers, alsof je een bal vasthoudt'),

  polsen: () => wrap(`
    <rect x="12" y="132" width="132" height="18" rx="3"/>
    <path d="M12 94 L80 96" stroke-width="14"/>
    <path d="M80 96 Q110 86 124 104 L128 130" stroke-width="10"/>
    <text x="72" y="182" stroke="none" fill="#3ccf8e" font-size="15" font-weight="800" text-anchor="middle" font-family="Manrope,sans-serif">✓ pols recht</text>
    <rect x="176" y="132" width="132" height="18" rx="3"/>
    <path d="M176 92 L236 126" stroke-width="14"/>
    <path d="M236 126 Q262 92 282 100 L292 130" stroke-width="10"/>
    <text x="242" y="182" stroke="none" fill="#ff5a5a" font-size="15" font-weight="800" text-anchor="middle" font-family="Manrope,sans-serif">✗ pols gezakt</text>`, 'Rechte pols tegenover gezakte pols'),

  schouders: () => wrap(`
    <circle cx="160" cy="44" r="22"/>
    <path d="M160 66 L160 150"/>
    <path d="M160 82 Q120 84 104 102 L96 150"/>
    <path d="M160 82 Q200 84 216 102 L224 150"/>
    <path d="M100 74 L100 58 M92 66 L100 58 L108 66" stroke="${G}" stroke-width="3"/>
    <path d="M220 58 L220 74 M212 66 L220 74 L228 66" stroke="${G}" stroke-width="3"/>
    <text x="160" y="186" stroke="none" fill="${G}" font-size="14" font-weight="700" text-anchor="middle" font-family="Manrope,sans-serif">schouders laag en los</text>`, 'Ontspannen schouders, vooraanzicht'),

  hands: () => bothHandsSVG(),
};

export function illustration(key) {
  const f = ILLUSTRATIONS[key];
  return f ? f() : '';
}
