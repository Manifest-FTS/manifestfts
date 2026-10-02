const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'public/signal/tokens.css'), 'utf8');
const color = token => {
  const match = css.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `Missing token ${token}`);
  return match[1];
};
const luminance = hex => {
  const c = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return c[0] * .2126 + c[1] * .7152 + c[2] * .0722;
};
const contrast = (a, b) => {
  const x = luminance(color(a)); const y = luminance(color(b));
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
};

test('reading and accent text pass AAA on all supported warm surfaces', () => {
  for (const foreground of ['--text-primary', '--text-secondary', '--accent-signal-hover']) {
    for (const background of ['--bg-canvas', '--bg-surface', '--bg-elevated', '--success-subtle', '--warning-subtle']) {
      assert.ok(contrast(foreground, background) >= 7, `${foreground} on ${background} must meet 7:1`);
    }
  }
});
test('CTA labels and essential boundaries meet their contrast targets', () => {
  for (const bg of ['--accent-signal-primary', '--accent-signal-hover']) assert.ok(contrast('--bg-elevated', bg) >= 7);
  for (const bg of ['--bg-canvas', '--bg-surface', '--bg-elevated']) assert.ok(contrast('--border-strong', bg) >= 3);
});
test('downloaded fonts retain exact upstream binaries and license notices', () => {
  for (const [family, binary, local] of [
    ['newsreader', 'newsreader-latin-standard-normal.woff2', 'newsreader'],
    ['plus-jakarta-sans', 'plus-jakarta-sans-latin-wght-normal.woff2', 'jakarta'],
  ]) {
    const upstream = path.join(root, 'node_modules/@fontsource-variable', family);
    assert.deepEqual(fs.readFileSync(path.join(root, `public/signal/${local}.woff2`)), fs.readFileSync(path.join(upstream, 'files', binary)));
    const normalize = text => text.replace(/\r\n/g, '\n').trimEnd();
    assert.equal(normalize(fs.readFileSync(path.join(root, `public/signal/${local}-license.txt`), 'utf8')),
      normalize(fs.readFileSync(path.join(upstream, 'LICENSE'), 'utf8')));
  }
});
test('portable Tailwind extension references canonical scoped tokens', () => {
  const extension = require('../signal.tailwind');
  for (const value of Object.values(extension.colors.signal)) {
    const token = value.match(/var\(([^)]+)\)/)[1];
    color(token);
  }
  assert.ok(css.includes('.signal-theme {'));
  assert.ok(!css.includes(':root {'));
});