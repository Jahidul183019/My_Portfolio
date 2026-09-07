import { test } from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';
import handler from '../api/contact.js';

async function request(method, body) {
  const res = { code: 200, headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(code) { this.code=code; return this; }, json(body) { this.body=body; return this; }, end() { return this; } };
  await handler({method,body},res);
  return res;
}

test('rejects malformed requests before opening SMTP', async () => {
  const original=nodemailer.createTransport;
  nodemailer.createTransport=() => { throw new Error('SMTP must not be reached'); };
  try {
    for (const body of ['{', null, [], {}, {name:7,email:'x@y.com',message:'long enough message'}, {name:'A',email:'bad',message:'long enough message'}, {name:'A',email:'x@y.com',message:'short'}, {name:'A'.repeat(101),email:'x@y.com',message:'long enough message'}, {name:'A',email:'x@y.com',message:'x'.repeat(5001)}, {name:'A\r\nInjected',email:'x@y.com',message:'long enough message'}]) {
      assert.equal((await request('POST',body)).code,400);
    }
    assert.equal((await request('GET')).code,405);
    assert.equal((await request('OPTIONS')).code,200);
  } finally { nodemailer.createTransport=original; }
});

test('sends trimmed text-only mail with replyTo; no real delivery', async () => {
  const original=nodemailer.createTransport;
  const vars=['SMTP_USER','SMTP_PASS','CONTACT_TO_EMAIL'];
  const previous=vars.map(k=>process.env[k]);
  for(const key of vars) process.env[key]='mock@example.com';
  let delivered, transportOptions;
  nodemailer.createTransport=options => { transportOptions=options; return {sendMail:async mail=>{delivered=mail;}}; };
  try {
    const result=await request('POST',JSON.stringify({name:'  Visitor  ',email:' visitor@example.com ',message:'<script>alert("test")</script>'}));
    assert.equal(result.code,200);
    assert.equal(transportOptions.connectionTimeout,10000);
    assert.equal(transportOptions.greetingTimeout,10000);
    assert.equal(transportOptions.socketTimeout,20000);
    assert.equal(delivered.replyTo,'visitor@example.com');
    assert.equal(delivered.subject,'Portfolio contact from Visitor');
    assert.equal(delivered.html,undefined);
    assert.match(delivered.text,/<script>/);
    let attempts=0;
    nodemailer.createTransport=()=>({sendMail:async()=>{attempts++;throw new Error('mock SMTP failure');}});
    assert.equal((await request('POST',{name:'A',email:'a@example.com',message:'long enough message'})).code,500);
    assert.equal(attempts,1);
  } finally {
    nodemailer.createTransport=original;
    vars.forEach((key,i)=>{if(previous[i]===undefined) delete process.env[key]; else process.env[key]=previous[i];});
  }
});
