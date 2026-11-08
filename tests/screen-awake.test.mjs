import test from 'node:test';import assert from 'node:assert/strict';
import {keepRecipeScreenAwake} from '../lib/screen-awake.ts';
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function setup(request){const events=new EventTarget();events.visibilityState='visible';return {events,stop:keepRecipeScreenAwake(events,{request})};}
test('recipe screen lock is acquired, released on hide, reacquired on return and released on close',async()=>{
 const locks=[];const {events,stop}=setup(async type=>{assert.equal(type,'screen');const lock=new EventTarget();lock.release=async()=>{lock.released=true;lock.dispatchEvent(new Event('release'));};locks.push(lock);return lock;});
 await settle();assert.equal(locks.length,1);
 events.visibilityState='hidden';events.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(locks[0].released,true);
 events.visibilityState='visible';events.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(locks.length,2);
 stop();await settle();assert.equal(locks[1].released,true);
 events.dispatchEvent(new Event('visibilitychange'));await settle();assert.equal(locks.length,2);
});
test('closing a recipe before the lock request resolves releases the late lock',async()=>{
 let resolve,released=false;const {stop}=setup(()=>new Promise(r=>resolve=r));stop();resolve({release:async()=>{released=true;},addEventListener(){}});await settle();assert.equal(released,true);
});
test('unsupported and denied screen locks leave the recipe usable without retry loops',async()=>{
 const events=new EventTarget();events.visibilityState='visible';assert.doesNotThrow(()=>keepRecipeScreenAwake(events,undefined)());
 let count=0;const stop=keepRecipeScreenAwake(events,{request:async()=>{count++;throw new Error('Denied');}});await settle();assert.equal(count,1);stop();
});
