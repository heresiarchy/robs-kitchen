import test from 'node:test';
import assert from 'node:assert/strict';
import {buildShoppingList, planConsumption, parseIngredient, expiryState, parseReceipt, validateInput, mcpTools} from '../lib/kitchen.ts';
const recipe=(ingredients,servings=2)=>({id:'r1',title:'Dinner',servings,ingredients,method:[],notes:'',sourceUrl:'',original:null,tags:[],minutes:30,revision:1});
const stock=(name,quantity,unit,rest={})=>({id:Math.random().toString(),name,quantity,unit,location:'Pantry',expiry:'',dateType:'unknown',revision:1,...rest});
test('combines scaled recipe demand and subtracts compatible pantry quantities once',()=>{
 const result=buildShoppingList([{recipe:recipe([{name:'Rice',quantity:100,unit:'g'}]),servings:4},{recipe:recipe([{name:'rice',quantity:0.2,unit:'kg'}]),servings:2}], [stock('rice',0.15,'kg')], '2026-11-06');
 assert.equal(result.length,1); assert.equal(result[0].quantity,250); assert.equal(result[0].unit,'g'); assert.equal(result[0].inStock,150);
});
test('does not deduct incompatible or expired use-by stock',()=>{
 const result=buildShoppingList([{recipe:recipe([{name:'Milk',quantity:500,unit:'ml'}]),servings:2}], [stock('milk',2,'each'),stock('milk',1,'l',{expiry:'2026-11-05',dateType:'use-by'})], '2026-11-06');
 assert.equal(result[0].quantity,500);
});
test('keeps best-before stock available and unknown dates explicit',()=>{
 assert.equal(expiryState(stock('rice',1,'kg'), '2026-11-06'),'unknown');
 assert.equal(buildShoppingList([{recipe:recipe([{name:'rice',quantity:300,unit:'g'}]),servings:2}],[stock('rice',1,'kg',{expiry:'2026-11-05',dateType:'best-before'})], '2026-11-06').length,0);
});
test('consumption uses oldest eligible batches first without negative quantities',()=>{
 const a=stock('rice',100,'g',{id:'a',expiry:'2026-12-01'}), b=stock('rice',300,'g',{id:'b',expiry:'2026-11-10'});
 const p=planConsumption(recipe([{name:'rice',quantity:350,unit:'g'}]),2,[a,b],'2026-11-06');
 assert.deepEqual(p.changes.map(x=>[x.id,x.quantity]),[['b',0],['a',50]]); assert.equal(p.missing.length,0);
});
test('parses fractions and metric recipe quantities preserving raw text',()=>{
 assert.equal(parseIngredient('1½ tbsp olive oil').quantity,1.5); assert.equal(parseIngredient('1/2 kg potatoes').quantity,0.5); assert.equal(parseIngredient('200 g rice').name,'rice');
});
test('receipt parsing takes explicit dates only and keeps uncertain dates unknown',()=>{
 const r=parseReceipt('Milk 2 l use by 09/11/2026\nRice 500 g\nTotal £8.00');
 assert.equal(r.length,2); assert.equal(r[0].expiry,'2026-11-09'); assert.equal(r[1].expiry,''); assert.equal(r[1].dateType,'unknown');
});
test('rejects invalid quantities, impossible dates and missing mutation IDs',()=>{
 assert.throws(()=>validateInput('save_stock',{item:stock('rice',-1,'g'),operationId:'op'}));
 assert.throws(()=>validateInput('save_stock',{item:stock('rice',1,'g',{expiry:'2026-02-31'}),operationId:'op'}));
 assert.throws(()=>validateInput('save_stock',{item:stock('rice',1,'g')}));
});
test('MCP advertises reads and kitchen mutations with closed object schemas',()=>{
 for (const name of ['get_kitchen','save_recipe','save_stock','create_shopping_list','stage_import','approve_import','record_cook','get_import_attachment']) assert.ok(mcpTools.find(x=>x.name===name),name);
 for (const tool of mcpTools) assert.equal(tool.inputSchema.type,'object');
});
test('past dates with unknown type are not labelled best-before or deducted',()=>{const s=stock('milk',1,'l',{expiry:'2026-11-05',dateType:'unknown'});assert.equal(expiryState(s,'2026-11-06'),'past-date');assert.equal(buildShoppingList([{recipe:recipe([{name:'milk',quantity:500,unit:'ml'}]),servings:2}],[s],'2026-11-06')[0].quantity,500);});
test('non-metric source quantities stay unsupported rather than becoming each',()=>{assert.equal(parseIngredient('2 cups flour').unit,'cups');});
test('consuming small amounts from kg batches keeps accurate stock',()=>{const p=planConsumption(recipe([{name:'rice',quantity:.4,unit:'g'}]),2,[stock('rice',1,'kg',{id:'r'})],'2026-11-06');assert.equal(p.changes[0].quantity,.9996);});
