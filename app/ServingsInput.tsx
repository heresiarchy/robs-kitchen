'use client';
import {useEffect,useState} from 'react';
import {validServings} from '@/lib/servings';
export default function ServingsInput({value,onChange,label,onValidityChange}:{value:number;onChange:(n:number)=>void;label:string;onValidityChange?:(valid:boolean)=>void}){
 const [draft,setDraft]=useState(String(value));
 useEffect(()=>{setDraft(current=>Number(current)===value?current:String(value));},[value]);
 return <input aria-label={label} type="number" inputMode="decimal" required min="0.25" max="1000" step="0.25" value={draft} onChange={e=>{const text=e.target.value;setDraft(text);const n=validServings(text);onValidityChange?.(n!==null);if(n!==null)onChange(n);}}/>;
}
