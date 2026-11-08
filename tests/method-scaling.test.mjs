import test from 'node:test';import assert from 'node:assert/strict';import {scaleMethodHtml} from '../lib/method-scaling.ts';
const ingredients=[{name:'dark chocolate square',quantity:1,unit:'each'},{name:'egg',quantity:2,unit:'each'}];
test('scales instruction quantities but leaves timings, temperatures, steps and proportions intact',()=>{assert.equal(scaleMethodHtml('<h3>1. Bake</h3><p>Mix 50g oats, ½ tsp baking powder and 160 ml milk. Add 1 square chocolate and 2 eggs. Bake at 180°C for 20–25 minutes in a 15 cm dish. Use 1/3 of the batter.</p>',2,ingredients),'<h3>1. Bake</h3><p>Mix 100g oats, 1 tsp baking powder and 320 ml milk. Add 2 square chocolate and 4 eggs. Bake at 180°C for 20–25 minutes in a 15 cm dish. Use 1/3 of the batter.</p>');});
test('preserves rich text and URLs including quantities split across inline tags',()=>{assert.equal(scaleMethodHtml('<p>Add <strong>50</strong> g oats and <em>1 1/2 tbsp</em> oil. <a href="https://example.com/50g">Source</a></p>',.5,[]),'<p>Add <strong>25</strong> g oats and <em>0.75 tbsp</em> oil. <a href="https://example.com/50g" target="_blank" rel="noopener noreferrer">Source</a></p>');});
test('scales partial ingredient quantities, keeps unrecognised counts and does not mutate source',()=>{const html='<p>Reserve 10 g butter; melt remaining 40 g. Use a 2 litre pan and 1 serving dish.</p>';assert.equal(scaleMethodHtml(html,2,[]),'<p>Reserve 20 g butter; melt remaining 80 g. Use a 2 litre pan and 1 serving dish.</p>');assert.equal(scaleMethodHtml(html,1,[]),html);});
test('fraction at the beginning of a text block scales without swallowing whitespace',()=>{assert.equal(scaleMethodHtml('<p>½ tsp salt</p>',2,[]),'<p>1 tsp salt</p>');});
test('both ends of ingredient ranges scale while cooking ranges remain unchanged',()=>{assert.equal(scaleMethodHtml('<p>Add 10–20 g flour and 1-2 tsp water; cook 20–25 minutes.</p>',2,[]),'<p>Add 20–40 g flour and 2-4 tsp water; cook 20–25 minutes.</p>');});

test('scales approximate steak counts alongside mass even for ingredients stored in grams',()=>{
 const pork=[{name:'Pork shoulder steak (approximately 1 steak)',quantity:166,unit:'g'}];
 const html='<p>Pat <strong>1 pork shoulder steak</strong> (approximately <strong>166 g</strong>) dry. Brown 2 minutes per side in a 1 litre pan.</p>';
 assert.equal(scaleMethodHtml(html,2,pork),'<p>Pat <strong>2 pork shoulder steak</strong> (approximately <strong>332 g</strong>) dry. Brown 2 minutes per side in a 1 litre pan.</p>');
 assert.match(scaleMethodHtml(html,.5,pork),/<strong>0.5 pork shoulder steak<\/strong>/);
});

test('ingredient labels scale approximate counts without changing per-piece weights or source data',async()=>{
 const {scaleIngredientName}=await import('../lib/method-scaling.ts');
 const ingredient={name:'Pork shoulder steak (approximately 1 steak; 166 g per steak)',quantity:166,unit:'g'};
 assert.equal(scaleIngredientName(ingredient,2),'Pork shoulder steak (approximately 2 steak; 166 g per steak)');
 assert.equal(ingredient.name,'Pork shoulder steak (approximately 1 steak; 166 g per steak)');
 assert.equal(scaleIngredientName({...ingredient,name:'Pork & thyme <special> (approximately 1 steak)'},2),'Pork & thyme <special> (approximately 2 steak)');
});

test('scales named food counts with preparation words, variety names and both singular and plural forms',()=>{
 const food=[['Chicken thighs, bone-in skin-on',4],['Medium Yukon Gold potatoes',5],['Garlic cloves',8],['Fresh oregano sprig',1],['Bacon rashers',2],['Pitted prunes',10],['Whole chicken, Size 10',1],['Celery sticks',2],['Thyme sprigs',3],['Long red chillies',4],['Mango',1],['Cucumber',1]].map(([name,quantity])=>({name,quantity,unit:'each'}));
 const before='<p>4 bone-in, skin-on chicken thighs; 5 medium Yukon Gold potatoes; 8 minced garlic cloves; 1 sprig fresh oregano; 2 chopped bacon rashers; 10 pitted prunes; 1 portioned Size 10 chicken; 2 celery sticks; 3 thyme sprigs; 4 chillies; 1 mango; 1 cucumber.</p>';
 const after='<p>8 bone-in, skin-on chicken thighs; 10 medium Yukon Gold potatoes; 16 minced garlic cloves; 2 sprig fresh oregano; 4 chopped bacon rashers; 20 pitted prunes; 2 portioned Size 10 chicken; 4 celery sticks; 6 thyme sprigs; 8 chillies; 2 mango; 2 cucumber.</p>';
 assert.equal(scaleMethodHtml(before,2,food),after);
});
test('scales total ginger length and source cup equivalents without scaling cut sizes',()=>{
 const food=[{name:'Fresh ginger, 3 cm piece',quantity:1,unit:'each'}];
 assert.equal(scaleMethodHtml('<p>Blend 3 cm ginger. Add 200 g rice (1 cup). Cut chorizo into 3–4 cm pieces.</p>',2,food),'<p>Blend 6 cm ginger. Add 400 g rice (2 cup). Cut chorizo into 3–4 cm pieces.</p>');
});
test('ingredient label ranges and equivalent weights scale but per-piece weight stays fixed',async()=>{
 const {scaleIngredientName}=await import('../lib/method-scaling.ts');
 assert.equal(scaleIngredientName({name:'Pasta (150–200 g; midpoint for scaling)',quantity:175,unit:'g'},2),'Pasta (300–400 g; midpoint for scaling)');
 assert.equal(scaleIngredientName({name:'Olive oil (approx. 120 g)',quantity:132,unit:'ml'},2),'Olive oil (approx. 240 g)');
});

test('scales cinnamon sticks and explicit alternative fruit counts',()=>{
 const food=[{name:'Cinnamon stick',quantity:1,unit:'each'},{name:'Large pomegranate (or 2 small pomegranates)',quantity:1,unit:'each'}];
 assert.equal(scaleMethodHtml('<p>Add 1 cinnamon stick and 1 large pomegranate (or 2 small pomegranates).</p>',2,food),'<p>Add 2 cinnamon stick and 2 large pomegranate (or 4 small pomegranates).</p>');
});
