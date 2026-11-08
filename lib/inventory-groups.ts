import {expiryState,today} from './kitchen.ts';
import type {Stock} from './kitchen.ts';
import {groupByAisle} from './shopping-aisles.ts';
export type InventoryGrouping='none'|'location'|'category'|'expiry';
export function groupInventory<T extends Stock>(items:T[],by:InventoryGrouping,date=today()):{key:string;label:string;items:T[]}[]{
 if(!items.length)return [];
 if(by==='none')return [{key:'all',label:'All food',items:[...items]}];
 if(by==='category')return groupByAisle(items).map(g=>({key:g.aisle,label:g.aisle,items:g.items}));
 const order=by==='location'?['Fridge','Freezer','Pantry']:['expired','past-best-before','past-date','today','soon','fresh','unknown'];
 const labels:Record<string,string>={expired:'Past use-by','past-best-before':'Past best-before','past-date':'Past date · check type',today:'Use today',soon:'Use soon',fresh:'In date',unknown:'Date needed'};
 const groups=new Map<string,T[]>();
 for(const item of items){const key=by==='location'?item.location:expiryState(item,date);if(!groups.has(key))groups.set(key,[]);groups.get(key)!.push(item);}
 return order.filter(key=>groups.has(key)).map(key=>({key,label:labels[key]||key,items:groups.get(key)!}));
}
