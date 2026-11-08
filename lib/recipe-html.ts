import sanitizeHtml from 'sanitize-html';
import {decodeHTML} from 'entities';
export function sanitizeRecipeHtml(html:string):string {
 return sanitizeHtml(html,{allowedTags:['p','br','h2','h3','strong','b','em','i','u','s','ol','ul','li','blockquote','pre','code','hr','a'],allowedAttributes:{a:['href','title','target','rel']},allowedSchemes:['http','https','mailto'],allowProtocolRelative:false,transformTags:{a:sanitizeHtml.simpleTransform('a',{target:'_blank',rel:'noopener noreferrer'})}});
}
const escape=(text:string)=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
export const legacyMethodHtml=(steps:string[])=>steps.length?'<ol>'+steps.map(s=>'<li>'+escape(s).replace(/\n/g,'<br>')+'</li>').join('')+'</ol>':'';
export const legacyNotesHtml=(text:string)=>text?'<p>'+escape(text).replace(/\n/g,'<br>')+'</p>':'';
export function plainText(html:string):string {
 const safe=sanitizeRecipeHtml(html).replace(/<br\s*\/?>/gi,'\n').replace(/<\/(?:p|h2|h3|li|blockquote|pre)>/gi,'\n');
 return decodeHTML(sanitizeHtml(safe,{allowedTags:[],allowedAttributes:{}})).split('\n').map(s=>s.trim()).filter(Boolean).join('\n');
}
