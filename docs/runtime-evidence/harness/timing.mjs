import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const out='/Users/md.jahidulislam/Desktop/portfolio/docs/runtime-evidence';
const results=[], failures=[], network=[];
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
await context.route('**/*',route=>route.request().method()==='POST'?route.abort('blockedbyclient'):route.continue());
await context.addInitScript(()=>{
 const a=window.__audit={rafs:new Map(),intervals:new Map(),paints:0,commits:0,errors:[],listeners:new Map()};
 const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
 window.requestAnimationFrame=fn=>{const id=raf(t=>{a.rafs.delete(id);fn(t)});a.rafs.set(id,true);return id};
 window.cancelAnimationFrame=id=>{a.rafs.delete(id);cancel(id)};
 const si=window.setInterval.bind(window),ci=window.clearInterval.bind(window);
 window.setInterval=(fn,delay,...args)=>{const id=si(fn,delay,...args);a.intervals.set(id,delay);return id};window.clearInterval=id=>{a.intervals.delete(id);ci(id)};
 const clear=CanvasRenderingContext2D.prototype.clearRect;CanvasRenderingContext2D.prototype.clearRect=function(...args){a.paints++;return clear.apply(this,args)};
 const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
 EventTarget.prototype.addEventListener=function(type,fn,options){if(this===window||this===document){const key=(this===window?'window:':'document:')+type; if(!a.listeners.has(key))a.listeners.set(key,new Set());a.listeners.get(key).add(fn)}return add.call(this,type,fn,options)};
 EventTarget.prototype.removeEventListener=function(type,fn,options){if(this===window||this===document)a.listeners.get((this===window?'window:':'document:')+type)?.delete(fn);return remove.call(this,type,fn,options)};
 window.__REACT_DEVTOOLS_GLOBAL_HOOK__={supportsFiber:true,renderers:new Map(),inject(renderer){this.renderers.set(1,renderer);return 1},onCommitFiberRoot(){a.commits++},onCommitFiberUnmount(){},onPostCommitFiberRoot(){}};
 add.call(window,'error',e=>a.errors.push(e.message));add.call(window,'unhandledrejection',e=>a.errors.push(String(e.reason)));
});
const page=await context.newPage(); page.setDefaultTimeout(5000);
page.on('pageerror',error=>failures.push({kind:'pageerror',message:error.message}));
page.on('requestfailed',req=>network.push({url:req.url(),failure:req.failure()?.errorText,method:req.method()}));
page.on('response',res=>{if(res.status()>=400)network.push({url:res.url(),status:res.status()})});
const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
async function test(name,fn){try{const detail=await fn();results.push({name,status:'pass',detail});console.log('PASS',name)}catch(e){results.push({name,status:'fail',error:e.message});console.log('FAIL',name,e.message.slice(0,250)); await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(400)}fs.writeFileSync(out+'/timing-reservation.json',JSON.stringify({browser:browser.version(),results,failures,network},null,2))}
async function go(path='/'){await page.goto('http://127.0.0.1:4174'+path,{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(1000)}
async function tabTo(locator,max=80){for(let i=0;i<max;i++){if(await locator.evaluate(el=>el===document.activeElement))return i;await page.keyboard.press('Tab')}throw Error('Keyboard could not reach '+await locator.getAttribute('aria-label'))}
async function theme(light){const desired=light?'Switch to light theme':'Switch to dark theme';const button=page.getByRole('button',{name:desired,exact:true});if(await button.count())await button.click();await page.waitForTimeout(100)}
async function snap(){return page.evaluate(()=>({raf:__audit.rafs.size,intervals:[...__audit.intervals.values()],paints:__audit.paints,commits:__audit.commits,hidden:document.hidden,listeners:Object.fromEntries([...__audit.listeners].filter(([k])=>/pointer|resize|scroll|visibility/.test(k)).map(([k,v])=>[k,v.size]))}))}
async function navigate(path){await page.evaluate(path=>{history.pushState(null,'',path);dispatchEvent(new PopStateEvent('popstate'))},path);await page.waitForTimeout(1000)}
await test('project stagger measured from rendered opacity over frames',async()=>{await page.setViewportSize({width:1440,height:1400});const measured=[];for(const reducedMotion of ['no-preference','reduce']){await page.emulateMedia({reducedMotion});await go('/');const frames=await page.evaluate(async()=>{const elements=[...document.querySelectorAll('#projects button[aria-haspopup="dialog"]')].slice(0,6).map(e=>e.parentElement);const before=elements.map(e=>getComputedStyle(e).opacity);document.querySelector('#projects').scrollIntoView({behavior:'instant'});const start=performance.now(),samples=[];await new Promise(resolve=>{function sample(){samples.push({time:performance.now()-start,opacity:elements.map(e=>Number(getComputedStyle(e).opacity)),tops:elements.map(e=>e.getBoundingClientRect().top)});if(performance.now()-start<900)requestAnimationFrame(sample);else resolve()}requestAnimationFrame(sample)});return {before,samples}});const visible=frames.samples[0].tops.map((top,index)=>({top,index})).filter(x=>x.top<1400);const starts=visible.map(({index})=>frames.samples.find(f=>f.opacity[index]>.005)?.time);assert.ok(starts.every(x=>x!==undefined));const spread=Math.max(...starts)-Math.min(...starts);if(reducedMotion==='reduce'){assert.ok(frames.samples[0].opacity.every(x=>x===1));assert.equal(spread,0)}else{assert.ok(spread>=180&&spread<=320,'Measured delay spread '+spread)}measured.push({reducedMotion,starts,spread,before:frames.before,last:frames.samples.at(-1)})}return measured});
await test('delayed image decode keeps reserved container stable',async()=>{await page.emulateMedia({reducedMotion:'reduce'});let release;const gate=new Promise(r=>release=r);await page.route('**/images/project-*.webp',async r=>{await gate;await r.continue()});await page.goto('http://127.0.0.1:4174/projects',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);const img=page.locator('#projects img').first();const before=await img.evaluate(e=>({container:e.parentElement.getBoundingClientRect().toJSON(),complete:e.complete}));assert.equal(before.complete,false);release();await img.evaluate(e=>e.decode());const after=await img.evaluate(e=>({container:e.parentElement.getBoundingClientRect().toJSON(),complete:e.complete,currentSrc:e.currentSrc}));assert.equal(after.container.width,before.container.width);assert.equal(after.container.height,before.container.height);return {before,after}});
fs.writeFileSync(out+'/timing-reservation.json',JSON.stringify({results,failures,network},null,2));await browser.close();
