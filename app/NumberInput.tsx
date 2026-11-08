'use client';
import {useEffect,useState} from 'react';
import {Minus,Plus} from 'lucide-react';

// Keep the typed text separate from the last valid value held by the form.
export default function NumberInput({value,onChange,label,min=0,max,step='any',count=false}:{value:number;onChange:(n:number)=>void;label:string;min?:number;max?:number;step?:number|'any';count?:boolean}){
 const [draft,setDraft]=useState(String(value));
 useEffect(()=>{setDraft(current=>Number(current)===value&&current.trim()?current:String(value));},[value]);
 const change=(text:string)=>{setDraft(text);if(text.trim()&&Number.isFinite(Number(text)))onChange(Number(text));};
 const current=draft.trim()?Number(draft):0;
 const adjust=(amount:number)=>change(String(Math.min(max??Infinity,Math.max(min,Math.round((current+amount)*1e6)/1e6))));
 const input=<input aria-label={label} type="number" inputMode="decimal" required min={min} max={max} step={step} value={draft} onChange={e=>change(e.target.value)}/>;
 return count?<span className="quantity-stepper"><button type="button" aria-label={'Decrease '+label.toLowerCase()} disabled={current<=min} onClick={()=>adjust(-1)}><Minus size={15}/></button>{input}<button type="button" aria-label={'Increase '+label.toLowerCase()} disabled={max!==undefined&&current>=max} onClick={()=>adjust(1)}><Plus size={15}/></button></span>:input;
}
