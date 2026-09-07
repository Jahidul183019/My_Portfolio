import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import colors from 'tailwindcss/colors.js';

const css = readFileSync('src/index.css', 'utf8');
const rgb = hex => hex.replace('#', '').match(/../g).map(v => parseInt(v, 16) / 255);
const hsl = value => {
  const [h, s, l] = value.match(/[\d.]+/g).map(Number);
  const a = s / 100 * Math.min(l / 100, 1 - l / 100);
  return [0, 8, 4].map(n => { const k = (n + h / 30) % 12; return l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); });
};
const luminance = c => c.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
const ratio = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const token = (block, key) => hsl(block.match(new RegExp(`--${key}: ([^;]+)`))[1]);
const color = name => { const [hue, shade] = name.split('-'); return rgb(colors[hue][shade]); };
const mix = (a, b, amount) => a.map((v, i) => v * amount + b[i] * (1 - amount));
const white = [1, 1, 1];
function passes(a, b, label) {
  const result = ratio(a, b);
  assert.ok(result >= 4.5, `${label}: ${result.toFixed(2)}:1 < 4.5`);
  return result;
}

test('configured text/gradient colors meet 4.5:1 on the audited solid and tinted surfaces', () => {
  const dark = css.match(/:root \{([^}]+)/)[1], light = css.match(/\.light \{([^}]+)/)[1];
  for (const [name, block] of [['dark', dark], ['light', light]]) {
    const bg = token(block, 'background'), primary = token(block, 'primary');
    passes(primary, bg, `${name} primary text`);
    const errorBg = token(block, 'destructive'), errorFg = token(block, 'destructive-foreground');
    passes(errorFg, errorBg, `${name} error toast title`);
    passes(mix(errorFg, errorBg, .9), errorBg, `${name} error toast description`);
    passes(primary, mix(primary, bg, .15), `${name} primary text on 15% tint`);
    passes(token(block, 'primary-foreground'), primary, `${name} selected button`);
    passes(token(block, 'primary-foreground'), mix([0, 0, 0], primary, .1), `${name} selected count badge`);
    const code = readFileSync('src/sections/Hero.tsx', 'utf8');
    const tokens = [...code.matchAll(/text-([a-z]+-700) dark:text-([a-z]+-300)/g)];
    for (const match of tokens) passes(color(match[name === 'light' ? 1 : 2]), token(block, 'card'), `${name} code ${match[1]}`);
    passes(color(name === 'light' ? 'red-700' : 'red-300'), token(block, 'card'), `${name} errors`);
  }
  const button = readFileSync('src/components/ui/button.tsx', 'utf8').match(/from-([a-z]+-\d+) to-([a-z]+-\d+) text-white/);
  const endpoints = [color(button[1]), color(button[2])];
  let minimum = Infinity;
  for (let i = 0; i <= 100; i++) minimum = Math.min(minimum, passes(white, mix(...endpoints, i / 100), 'button gradient'));
  for (const [selector, block] of [['text-gradient', dark], ['light .text-gradient', light]]) {
    const rule = css.slice(css.indexOf(`.${selector} {`)).split('}')[0];
    const [, from, to] = rule.match(/from-([a-z]+-\d+) to-([a-z]+-\d+)/);
    for (let i = 0; i <= 100; i++) passes(mix(color(from), color(to), i / 100), token(block, 'background'), `${selector} gradient`);
  }
  console.log(`Configured button gradient minimum across 101 sRGB samples: ${minimum.toFixed(2)}:1; light primary: ${ratio(token(light, 'primary'), white).toFixed(2)}:1`);
});
