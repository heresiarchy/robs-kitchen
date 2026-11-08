import test from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeRecipeHtml,plainText,legacyMethodHtml,legacyNotesHtml} from '../lib/recipe-html.ts';
import {recipeSchema} from '../lib/kitchen.ts';
test('formatting survives while active content and unsafe links are removed',()=>{
 const html=sanitizeRecipeHtml('<h2>Prep</h2><p><strong>Mix</strong> <em>well</em><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)">bad</a><a href="https://example.com" onclick="evil()">source</a></p>');
 assert.match(html,/<h2>Prep<\/h2>/);assert.match(html,/<strong>Mix<\/strong>/);assert.doesNotMatch(html,/script|img|onclick|javascript/);assert.match(html,/https:\/\/example.com/);
});
test('legacy recipes are escaped and readable',()=>{assert.equal(legacyMethodHtml(['<img> & mix','Cook']),'<ol><li>&lt;img&gt; &amp; mix</li><li>Cook</li></ol>');assert.equal(plainText(legacyNotesHtml('A & B\nNext')),'A & B\nNext');});
test('rich fields normalize safe HTML and synchronized plain text',()=>{const r=recipeSchema.parse({title:'Rice',servings:2,ingredients:[{name:'rice',quantity:200,unit:'g'}],method:['old'],notes:'old',methodHtml:'<ol><li><b>Rinse</b></li><li>Cook &amp; serve</li></ol>',notesHtml:'<p><u>Less salt</u></p>'});assert.deepEqual(r.method,['Rinse','Cook & serve']);assert.equal(r.notes,'Less salt');assert.match(r.notesHtml,/<u>/);});
test('empty rich text clears the previous plain text',()=>{const r=recipeSchema.parse({title:'Rice',servings:2,ingredients:[{name:'rice',quantity:200,unit:'g'}],method:['old'],notes:'old',methodHtml:'',notesHtml:'<p></p>'});assert.deepEqual(r.method,[]);assert.equal(r.notes,'');});
