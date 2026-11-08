import test from 'node:test';
import assert from 'node:assert/strict';
import {selectInventory} from '../lib/inventory-view.ts';
const item=(id,expiry,opened=false,quantity=1,location='Fridge',dateType='use-by')=>({id,name:id,expiry,opened,quantity,location,dateType,unit:'each',notes:''});
const stock=[item('opened','',true),item('expired','2026-11-06'),item('soon','2026-11-09'),item('fresh','2026-12-01'),item('empty','2026-11-07',false,0),item('unknown',''),item('best-before','2026-11-05',false,1,'Pantry','best-before')];
test('dashboard attention and Food use-soon filter return the same nonempty batches in date order',()=>{
 const result=selectInventory(stock,{dateFilter:'Use soon'},'2026-11-07');
 assert.deepEqual(result.map(x=>x.id),['best-before','expired','soon','opened']);
 assert.equal(stock[0].id,'opened');
});
test('Food filters combine location, search and date without leaking into attention',()=>{
 assert.deepEqual(selectInventory(stock,{location:'Pantry',search:'best',dateFilter:'Use soon'},'2026-11-07').map(x=>x.id),['best-before']);
 assert.equal(selectInventory(stock,{dateFilter:'Use soon'},'2026-11-07').length,4);
 assert.deepEqual(selectInventory(stock,{dateFilter:'Date needed'},'2026-11-07').map(x=>x.id),['unknown']);
});
test('opening and consuming batches updates attention membership from current stock',()=>{
 const food=[item('milk','2026-12-01')];
 assert.equal(selectInventory(food,{dateFilter:'Use soon'},'2026-11-07').length,0);
 food[0].opened=true;
 assert.equal(selectInventory(food,{dateFilter:'Use soon'},'2026-11-07').length,1);
 food[0].quantity=0;
 assert.equal(selectInventory(food,{dateFilter:'Use soon'},'2026-11-07').length,0);
});
