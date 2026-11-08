import test from 'node:test';import assert from 'node:assert/strict';import {validServings} from '../lib/servings.ts';
test('servings allow an empty draft without treating it as a quarter serving',()=>{assert.equal(validServings(''),null);assert.equal(validServings(' '),null);assert.equal(validServings('2'),2);assert.equal(validServings('0.25'),.25);assert.equal(validServings('1.5'),1.5);});
test('incomplete or out-of-range serving drafts cannot trigger cooking or shopping',()=>{for(const s of ['0','-1','0.1','1.3','1001','Infinity','-','.'])assert.equal(validServings(s),null,s);});
