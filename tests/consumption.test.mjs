import test from 'node:test';import assert from 'node:assert/strict';
import {expiryState} from '../lib/kitchen.ts';
import {consumeAmount} from '../lib/consumption.ts';
test('opened food is use soon without changing its printed expiry or overriding past-date warnings',()=>{
 assert.equal(expiryState({opened:true,expiry:'',dateType:'unknown'},'2026-11-07'),'soon');
 assert.equal(expiryState({opened:true,expiry:'2027-01-01',dateType:'best-before'},'2026-11-07'),'soon');
 assert.equal(expiryState({opened:true,expiry:'2026-11-06',dateType:'use-by'},'2026-11-07'),'expired');
 assert.equal(expiryState({opened:true,expiry:'2026-11-07',dateType:'use-by'},'2026-11-07'),'today');
});
test('consumption removes one item or a percentage of the remaining batch without going negative',()=>{
 assert.equal(consumeAmount(6,1,'amount'),5);
 assert.equal(consumeAmount(664,25,'percent'),498);
 assert.equal(consumeAmount(498,50,'percent'),249);
 assert.equal(consumeAmount(500,100,'percent'),0);
 assert.equal(consumeAmount(.5,.4,'amount'),.1);
 assert.throws(()=>consumeAmount(1,2,'amount'));
 assert.throws(()=>consumeAmount(100,101,'percent'));
 assert.throws(()=>consumeAmount(100,-1,'amount'));
 assert.throws(()=>consumeAmount(100,NaN,'amount'));
});
