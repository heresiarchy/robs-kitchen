import {expiryState,today} from './kitchen.ts';
import type {Stock} from './kitchen.ts';
export function selectInventory<T extends Stock>(stock:T[],{location='All food',search='',dateFilter='All dates'}:{location?:string;search?:string;dateFilter?:string}={},day=today()):T[]{
 return stock.filter(s=>{
  if(s.quantity<=0||(location!=='All food'&&s.location!==location)||!`${s.name} ${s.notes||''}`.toLowerCase().includes(search.toLowerCase()))return false;
  const status=expiryState(s,day);
  return dateFilter==='All dates'||(dateFilter==='Use soon'?['soon','today','expired','past-best-before','past-date'].includes(status):status==='unknown');
 }).sort((a,b)=>(a.expiry||'9999').localeCompare(b.expiry||'9999'));
}
