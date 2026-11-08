'use client';
import {useEffect,useState} from 'react';
import {keepRecipeScreenAwake} from '@/lib/screen-awake';
export default function RecipeScreenAwake(){
 const [enabled,setEnabled]=useState(true),[active,setActive]=useState(false),[supported,setSupported]=useState(false);
 useEffect(()=>{setSupported(!!navigator.wakeLock);if(!enabled)return;return keepRecipeScreenAwake(document,navigator.wakeLock,setActive);},[enabled]);
 if(!supported)return null;
 return <label className="recipe-screen-awake"><input type="checkbox" checked={enabled} onChange={e=>setEnabled(e.target.checked)}/><span>Keep screen awake{active&&<small> · On</small>}</span></label>;
}
