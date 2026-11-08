export function validServings(value:string):number|null{if(!value.trim())return null;const n=Number(value);return Number.isFinite(n)&&n>=.25&&n<=1000&&Number.isInteger(n*4)?n:null;}
