import test from 'node:test';
import assert from 'node:assert/strict';
import {groupInventory} from '../lib/inventory-groups.ts';
const food=(id,name,location,expiry,dateType='use-by')=>({id,name,location,expiry,dateType,quantity:1,unit:'each'});
const items=[food('a','Milk','Fridge','2026-11-09'),food('b','Rice','Pantry',''),food('c','Frozen peas','Freezer','2026-12-01','best-before'),food('d','Chicken','Fridge','2026-11-06'),food('e','Cheese','Fridge','2026-11-06','best-before'),food('f','Carrot','Fridge','2026-11-06','unknown')];
test('location grouping preserves batches, input order and source records',()=>{
 const before=JSON.stringify(items),g=groupInventory(items,'location','2026-11-07');
 assert.deepEqual(g.map(x=>x.label),['Fridge','Freezer','Pantry']);
 assert.deepEqual(g[0].items.map(x=>x.id),['a','d','e','f']);
 assert.equal(g.flatMap(x=>x.items).length,items.length);assert.equal(JSON.stringify(items),before);
});
test('expiry grouping keeps use-by, best-before and unknown-type past dates distinct',()=>{
 const g=groupInventory(items,'expiry','2026-11-07');
 assert.equal(g.find(x=>x.key==='expired').items[0].id,'d');
 assert.equal(g.find(x=>x.key==='past-best-before').items[0].id,'e');
 assert.equal(g.find(x=>x.key==='past-date').items[0].id,'f');
 assert.equal(g.find(x=>x.key==='unknown').items[0].id,'b');
});
test('category grouping uses grocery categories and no-group mode leaves ordering intact',()=>{
 const g=groupInventory(items,'category','2026-11-07');
 assert.equal(g.find(x=>x.label==='Dairy, eggs & alternatives').items.length,2);
 assert.deepEqual(groupInventory(items,'none','2026-11-07')[0].items,items);
 assert.deepEqual(groupInventory([],'expiry','2026-11-07'),[]);
});
