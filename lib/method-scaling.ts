import {sanitizeRecipeHtml,plainText} from './recipe-html.ts';
type Ingredient={name:string;quantity:number;unit:string};
const fractions:Record<string,number>={'¼':.25,'½':.5,'¾':.75,'⅓':1/3,'⅔':2/3,'⅛':.125,'⅜':.375,'⅝':.625,'⅞':.875};
function numberValue(s:string){const mixed=s.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(mixed)return Number(mixed[1])+Number(mixed[2])/Number(mixed[3]);const ratio=s.match(/^(\d+)\/(\d+)$/);if(ratio)return Number(ratio[1])/Number(ratio[2]);const glyph=s.match(/^(\d*)\s*([¼½¾⅓⅔⅛⅜⅝⅞])$/);return glyph?Number(glyph[1]||0)+fractions[glyph[2]]:Number(s);}
// Alter text characters only: HTML attributes, formatting, times and temperatures stay intact.
function scaleHtml(html:string,factor:number,ingredients:Ingredient[],countsOnly=false):string{
 const safe=sanitizeRecipeHtml(html);if(factor===1||!Number.isFinite(factor)||factor<=0)return safe;
 const tokens=safe.split(/(<[^>]*>)/g);let text='';const positions:({token:number;offset:number}|null)[]=[];
 tokens.forEach((token,index)=>{if(token.startsWith('<')){if(/^<\/?(?:p|li|h[23]|br|blockquote|pre)\b/i.test(token)){text+='\n';positions.push(null);}return;}for(let offset=0;offset<token.length;offset++){text+=token[offset];positions.push({token:index,offset});}});
 const nouns=['egg(?:s)?','onions?','cloves?','lemons?','limes?','squares?','carrots?','potato(?:es)?','tomato(?:es)?','peppers?','fillets?','steaks?','slices?','apples?','bananas?','chicken','thighs?','breasts?','rashers?','prunes?','sticks?','sprigs?','chill(?:i|ies|y|ies)s?','mango(?:es|s)?','cucumbers?','pomegranates?'];
 const modifiers='(?:(?:large|small|medium|extra|fresh|red|brown|whole|pork|shoulder|chicken|beef|bone-in,?|skin-on|diced|chopped|crushed|minced|sliced|garlic|celery|thyme|cinnamon|bacon|pitted|portioned|Size \\d+|Yukon|Gold)\\s+)*';
 const counts=nouns.filter(noun=>ingredients.some(i=>new RegExp('\\b'+noun+'\\b','i').test(i.name)&&(i.unit==='each'||new RegExp('[0-9¼½¾⅓⅔⅛⅜⅝⅞]\\s*'+modifiers+noun+'\\b','i').test(i.name)))).map(noun=>modifiers+noun);
 const ginger=ingredients.some(i=>/ginger/i.test(i.name))?['cm(?=\\s+(?:fresh\\s+)?ginger\\b)']:[];
 const unit=[...(countsOnly?[]:['kilograms?','grams?','kg','g','millilitres?','milliliters?','ml','litres?','liters?','l','tablespoons?','teaspoons?','tbsp','tsp','cups?',...ginger,'each']),...counts].join('|');
 if(!unit)return safe;
 const amount='(?:\\d+\\s+\\d+/\\d+|\\d+/\\d+|(?:\\d+\\s*)?[¼½¾⅓⅔⅛⅜⅝⅞]|\\d+(?:\\.\\d+)?)';
 const pattern=new RegExp('(?<![\\w.,/])('+amount+'(?:\\s*[–-]\\s*'+amount+')?)(\\s*)('+unit+')\\b','gi');
 const edits:{start:number;end:number;replacement:string}[]=[];
 for(const match of text.matchAll(pattern)){const tail=text.slice(match.index!+match[0].length);if(/^\s*(?:pan|dish|bowl|jug|tin|pot|container|baking tray|ramekin)\b/i.test(tail))continue;const parts=match[1].split(/(\s*[–-]\s*)/);if(parts.some((part,index)=>index%2===0&&!Number.isFinite(numberValue(part))))continue;const replacement=parts.map((part,index)=>index%2?part:String(Number((numberValue(part)*factor).toFixed(3)))).join('');edits.push({start:match.index!,end:match.index!+match[1].length,replacement});}
 for(const edit of edits.reverse()){let inserted=false;for(let index=edit.end-1;index>=edit.start;index--){const pos=positions[index];if(!pos)continue;const replacement=index===edit.start?edit.replacement:'';tokens[pos.token]=tokens[pos.token].slice(0,pos.offset)+replacement+tokens[pos.token].slice(pos.offset+1);inserted=true;}if(!inserted)continue;}
 return tokens.join('');
}

export function scaleMethodHtml(html:string,factor:number,ingredients:Ingredient[]):string{return scaleHtml(html,factor,ingredients);}
export function scaleIngredientName(ingredient:Ingredient,factor:number):string{
 const protectedValues:string[]=[];
 const name=ingredient.name.replace(/\d+(?:\.\d+)?\s*(?:kg|g|ml|l)\s+per\s+\w+/gi,m=>{protectedValues.push(m);return `PERPIECE${protectedValues.length-1}VALUE`;});
 const escaped=name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 return plainText(scaleHtml(escaped,factor,[ingredient])).replace(/PERPIECE(\d+)VALUE/g,(_,n)=>protectedValues[Number(n)]);
}
