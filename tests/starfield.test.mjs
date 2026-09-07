import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('starfield has one loop, pauses, resumes, and leaves none after unmount',()=>{
 const frames=new Map(); let next=0, paints=0, effect;
 const canvas={getContext:()=>({clearRect(){paints++;},beginPath(){},arc(){},fill(){}})};
 const events=()=>({listeners:new Map(),addEventListener(k,v){this.listeners.set(k,v);},removeEventListener(k){this.listeners.delete(k);}});
 const media={...events(),matches:false};
 const document={...events(),hidden:false};
 const window={...events(),innerWidth:320,innerHeight:700,matchMedia:()=>media};
 const module={exports:{}};
 const source=ts.transpileModule(readFileSync('src/components/Starfield.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText;
 vm.runInNewContext(source,{module,exports:module.exports,window,document,Math,requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id),require:name=>name==='react'?{useRef:()=>({current:canvas}),useEffect:fn=>{effect=fn;}}:{jsx:()=>null}});
 for(let visit=0;visit<3;visit++) {
  module.exports.Starfield(); const cleanup=effect();
  assert.equal(frames.size,1);
  const [id,frame]=frames.entries().next().value; frames.delete(id); frame();
  assert.equal(frames.size,1);
  window.listeners.get('resize')(); assert.equal(frames.size,1);
  document.hidden=true;document.listeners.get('visibilitychange')();assert.equal(frames.size,0);
  const before=paints;media.listeners.get('change')();assert.equal(paints,before);
  document.hidden=false;document.listeners.get('visibilitychange')();assert.equal(frames.size,1);
  media.matches=true;media.listeners.get('change')();assert.equal(frames.size,0);assert.ok(paints>before);
  media.matches=false;media.listeners.get('change')();media.listeners.get('change')();assert.equal(frames.size,1);
  cleanup();assert.equal(frames.size,0);assert.equal(window.listeners.size,0);assert.equal(document.listeners.size,0);assert.equal(media.listeners.size,0);
 }
});
