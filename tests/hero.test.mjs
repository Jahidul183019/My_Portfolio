import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('hero owns one interval, pauses hidden/offscreen/reduced, and cancels on cleanup', () => {
  const source = ts.transpileModule(readFileSync('src/sections/Hero.tsx', 'utf8').replace('import.meta.env.BASE_URL', '"/"'), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText;
  let effect, inView = true, reduced = false, nextId = 0, titleChanges = 0;
  const timers = new Map(), listeners = new Map();
  const document = { hidden: false, addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: key => listeners.delete(key) };
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, document,
    setInterval: fn => { const id = ++nextId; timers.set(id, fn); return id; }, clearInterval: id => timers.delete(id),
    require: name => {
      if (name === 'react') return { useState: () => [0, () => titleChanges++], useRef: () => ({ current: null }), useEffect: fn => { effect = fn; } };
      if (name === 'framer-motion') return { motion: { div: 'motion.div', span: 'motion.span' }, useInView: () => inView };
      if (name.includes('use-media-query')) return { useMediaQuery: () => reduced };
      if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
      return {};
    },
  });
  for (let cycle = 0; cycle < 3; cycle++) {
    module.exports.Hero(); const cleanup = effect();
    assert.equal(timers.size, 1);
    [...timers.values()][0](); assert.equal(titleChanges, cycle + 1);
    document.hidden = true; listeners.get('visibilitychange')(); assert.equal(timers.size, 0);
    document.hidden = false; listeners.get('visibilitychange')(); listeners.get('visibilitychange')(); assert.equal(timers.size, 1);
    cleanup(); assert.equal(timers.size, 0); assert.equal(listeners.size, 0);
  }
  for (const prefs of [[false, false], [true, true]]) {
    [inView, reduced] = prefs;
    const tree = module.exports.Hero(); effect(); assert.equal(timers.size, 0);
    if (reduced) {
      let checked = 0;
      const visit = node => {
        if (!node || typeof node !== 'object') return;
        if (String(node.type).startsWith('motion.')) {
          assert.equal(node.props.initial, false);
          assert.equal(node.props.transition.duration, 0);
          assert.equal(node.props.transition.delay, 0);
          checked++;
        }
        for (const child of [node.props?.children].flat()) visit(child);
      };
      visit(tree); assert.equal(checked, 4);
    }
  }
});

test('media hook updates an already mounted subscriber and removes its listener', () => {
  const source = ts.transpileModule(readFileSync('src/hooks/use-media-query.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  let effect, state, listener;
  const media = { matches: false, addEventListener: (_, fn) => { listener = fn; }, removeEventListener: (_, fn) => { assert.equal(fn, listener); listener = undefined; } };
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, window: { matchMedia: () => media }, require: () => ({ useState: fn => { state = fn(); return [state, value => { state = value; }]; }, useEffect: fn => { effect = fn; } }) });
  assert.equal(module.exports.useMediaQuery('(prefers-reduced-motion: reduce)'), false);
  const cleanup = effect();
  media.matches = true; listener(); assert.equal(state, true);
  media.matches = false; listener(); assert.equal(state, false);
  cleanup(); assert.equal(listener, undefined);
});
