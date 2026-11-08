export function consumeAmount(remaining:number,value:number,mode:'amount'|'percent'){
 if(!Number.isFinite(remaining)||remaining<0||!Number.isFinite(value)||value<=0||(mode==='percent'?value>100:value>remaining))throw new Error('Choose an amount between zero and what remains.');
 return Math.max(0,Number((remaining-(mode==='percent'?remaining*value/100:value)).toFixed(6)));
}
