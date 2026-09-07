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
async function test(name,fn){try{const detail=await fn();results.push({name,status:'pass',detail});console.log('PASS',name)}catch(e){results.push({name,status:'fail',error:e.message});console.log('FAIL',name,e.message.slice(0,250)); await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(400)}fs.writeFileSync(out+'/toast-contrast.json',JSON.stringify({browser:browser.version(),results,failures,network},null,2))}
async function go(path='/'){await page.goto('http://127.0.0.1:4174'+path,{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(1000)}
async function tabTo(locator,max=80){for(let i=0;i<max;i++){if(await locator.evaluate(el=>el===document.activeElement))return i;await page.keyboard.press('Tab')}throw Error('Keyboard could not reach '+await locator.getAttribute('aria-label'))}
async function theme(light){const desired=light?'Switch to light theme':'Switch to dark theme';const button=page.getByRole('button',{name:desired,exact:true});if(await button.count())await button.click();await page.waitForTimeout(100)}
for(const light of [false,true])await test('rendered error toast contrast '+light,async()=>{await go('/contact');await theme(light);await page.evaluate(()=>{window.fetch=async()=>new Response(JSON.stringify({error:'Mock server unavailable. Please try again later.'}),{status:503,headers:{'Content-Type':'application/json'}})});await page.getByLabel('Name',{exact:true}).fill('Runtime Tester');await page.getByLabel('Reply email',{exact:true}).fill('test@example.com');await page.getByLabel('Message',{exact:true}).fill('Mocked message; never send.');await page.getByRole('button',{name:'Send Message',exact:true}).click();await page.waitForTimeout(400);const axe=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();await page.screenshot({path:out+'/toast-'+(light?'light':'dark')+'.png'});const details=axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));fs.writeFileSync(out+'/toast-'+(light?'light':'dark')+'.json',JSON.stringify(details,null,2));assert.deepEqual(details,[]);return {violations:0}});
fs.writeFileSync(out+'/toast-contrast.json',JSON.stringify({results,failures,network},null,2));await browser.close();
