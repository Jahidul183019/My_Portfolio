import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('mouse coordinates use motion values, and disabled cursor attaches no pointer listeners',()=>{
 const source=ts.transpileModule(readFileSync('src/components/CustomCursor.tsx','utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS}}).outputText;
 for (const enabled of [true,false]) {
  const listeners=new Map(); let effect, stateWrites=0;
  const value=()=>({set(){},jump(){},stop(){}});
  const module={exports:{}};
  vm.runInNewContext(source,{module,exports:module.exports,Element:class {},window:{addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)},require:name=> {
   if(name==='react') return {useState:()=>[false,()=>stateWrites++],useEffect:fn=>{effect=fn;}};
   if(name==='framer-motion') return {motion:{div:'div'},useMotionValue:value,useSpring:value};
   if(name.includes('use-media-query')) return {useMediaQuery:()=>enabled};
   return {jsx:()=>null,jsxs:()=>null};
  }});
  module.exports.CustomCursor();const cleanup=effect();
  if(enabled) {
   for(let i=0;i<100;i++) listeners.get('pointermove')({pointerType:'mouse',clientX:i,clientY:i});
   listeners.get('pointermove')({pointerType:'touch',clientX:1,clientY:1});
   assert.equal(stateWrites,0);
   cleanup();
  }
  assert.equal(listeners.size,0);
 }
});
