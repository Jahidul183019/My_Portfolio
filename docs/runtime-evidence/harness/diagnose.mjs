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
async function test(name,fn){try{const detail=await fn();results.push({name,status:'pass',detail});console.log('PASS',name)}catch(e){results.push({name,status:'fail',error:e.message});console.log('FAIL',name,e.message.slice(0,250)); await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(400)}fs.writeFileSync(out+'/lifecycle.json',JSON.stringify({browser:browser.version(),results,failures,network},null,2))}
async function go(path='/'){await page.goto('http://127.0.0.1:4174'+path,{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(1000)}
async function tabTo(locator,max=80){for(let i=0;i<max;i++){if(await locator.evaluate(el=>el===document.activeElement))return i;await page.keyboard.press('Tab')}throw Error('Keyboard could not reach '+await locator.getAttribute('aria-label'))}
async function theme(light){const desired=light?'Switch to light theme':'Switch to dark theme';const button=page.getByRole('button',{name:desired,exact:true});if(await button.count())await button.click();await page.waitForTimeout(100)}
async function snap(){return page.evaluate(()=>({raf:__audit.rafs.size,intervals:[...__audit.intervals.values()],paints:__audit.paints,commits:__audit.commits,hidden:document.hidden,listeners:Object.fromEntries([...__audit.listeners].filter(([k])=>/pointer|resize|scroll|visibility/.test(k)).map(([k,v])=>[k,v.size]))}))}
async function navigate(path){await page.evaluate(path=>{history.pushState(null,'',path);dispatchEvent(new PopStateEvent('popstate'))},path);await page.waitForTimeout(1000)}
await go('/verification-unknown');const cycles=[];for(let i=0;i<3;i++){await navigate('/');const home=await snap();await navigate('/verification-unknown');cycles.push({home,absent:await snap(),resize:await page.evaluate(()=>[...__audit.listeners.get('window:resize')||[]].map(fn=>fn.toString()))})}console.log('CYCLES',JSON.stringify(cycles));
await page.setViewportSize({width:375,height:900});await go('/');const rects=[];for(const id of ['about','projects','contact','projects','about','home']){await page.getByRole('button',{name:'Toggle mobile menu'}).click();await page.locator('#mobile-navigation').getByRole('button',{name:new RegExp('^'+id+'$','i')}).click();for(const wait of [300,800,1000]){await page.waitForTimeout(wait);rects.push(await page.locator('#'+id).evaluate((e,args)=>({id:args.id,wait:args.wait,scrollY,section:e.getBoundingClientRect().top,heading:e.querySelector('h1,h2').getBoundingClientRect().top,header:document.querySelector('header').getBoundingClientRect().bottom,offset:getComputedStyle(e).scrollMarginTop,fonts:document.fonts.status}),{id,wait}))}await page.screenshot({path:out+'/anchor-'+id+'.png'})}console.log('ANCHORS',JSON.stringify(rects));fs.writeFileSync(out+'/diagnostics.json',JSON.stringify({cycles,rects},null,2));await browser.close();
