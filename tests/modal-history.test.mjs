import test from 'node:test';import assert from 'node:assert/strict';
import {modalHistory} from '../lib/modal-history.ts';
function browser(){const events=new EventTarget(),entries=[{url:'#home',state:{route:'home'}},{url:'#recipes',state:{route:'recipes'}}];let index=1;const history={get state(){return entries[index].state},pushState(state,unused,url){entries.splice(++index);entries.push({state,url:url||entries[index-1].url});},back(){if(index){index--;events.dispatchEvent(new Event('popstate'));}}};return {events,history,get url(){return entries[index].url},get length(){return entries.length}};}
test('first browser Back closes the modal and second Back navigates to the previous page',()=>{
 const b=browser();let visible=null;const nav=modalHistory(b.history,b.events,v=>visible=v,'test');nav.set({type:'recipe'});assert.equal(visible.type,'recipe');assert.equal(b.url,'#recipes');assert.equal(b.history.state.route,'recipes');b.history.back();assert.equal(visible,null);assert.equal(b.url,'#recipes');b.history.back();assert.equal(b.url,'#home');nav.destroy();
});
test('switching modal views uses one history entry and closing twice does not navigate away',()=>{
 const b=browser();let visible=null;const nav=modalHistory(b.history,b.events,v=>visible=v,'test');nav.set({type:'recipe'});nav.set({type:'edit'});assert.equal(b.length,3);assert.equal(visible.type,'edit');nav.set(null);assert.equal(b.url,'#recipes');nav.set(null);assert.equal(b.url,'#recipes');nav.destroy();
});
