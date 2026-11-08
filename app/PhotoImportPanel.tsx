'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,Upload,CheckCheck,AlertCircle,RefreshCw,Clock,ArrowRight,FileText,Plus,Sparkles} from 'lucide-react';
import {importPhotoState,queueFiles,runUploadQueue} from '@/lib/upload-queue';
import type {UploadEntry} from '@/lib/upload-queue';
import type {ImportRecord,KitchenState} from '@/lib/kitchen';

function Thumbnail({file}:{file:File}){const [url,setUrl]=useState('');useEffect(()=>{if(!file.type.startsWith('image/'))return;const value=URL.createObjectURL(file);setUrl(value);return()=>URL.revokeObjectURL(value);},[file]);return url?<img src={url} alt="" loading="lazy"/>:<FileText size={22}/>;}
export default function PhotoImportPanel({files,onReview,onChanged,onMore,onUploadingChange}:{files:File[];onReview:(item:ImportRecord)=>void;onChanged:()=>Promise<void>;onMore:()=>void;onUploadingChange:(running:boolean)=>void}){
 const [selection]=useState(()=>queueFiles(files));const [entries,setEntries]=useState<UploadEntry[]>(selection.entries);const [running,setRunning]=useState(false);const [refreshing,setRefreshing]=useState(false);const [error,setError]=useState('');const [retry,setRetry]=useState(0);const entriesRef=useRef(entries);entriesRef.current=entries;
 const done=entries.filter(e=>e.status==='uploaded').length;const errors=entries.filter(e=>e.status==='error').length;
 useEffect(()=>{let stopped=false;setRunning(true);onUploadingChange(true);
 const changed=(entry:UploadEntry)=>{if(!stopped)setEntries(current=>current.map(e=>e.id===entry.id?entry:e));};
 runUploadQueue(entriesRef.current,async entry=>{const form=new FormData();form.set('file',entry.file);form.set('operationId',entry.operationId);const response=await fetch('/api/upload',{method:'POST',body:form});const data:any=await response.json();if(!response.ok)throw new Error(data.error||'This file could not be uploaded.');return data;},changed,()=>stopped).finally(()=>{if(!stopped){setRunning(false);onUploadingChange(false);void onChanged();}});
 return()=>{stopped=true;onUploadingChange(false);};
 // Each retry deliberately keeps the same per-file operation IDs.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[retry]);
 async function refreshResults(){setRefreshing(true);setError('');try{const response=await fetch('/api/kitchen',{cache:'no-store'});const data:any=await response.json();if(!response.ok)throw new Error(data.error||'Could not check your imports.');const state=data as KitchenState;setEntries(current=>current.map(entry=>{const latest=state.imports.find(im=>im.id===entry.result?.id);return latest?{...entry,result:latest}:entry;}));await onChanged();}catch(e){setError((e as Error).message);}finally{setRefreshing(false);}}
 useEffect(()=>{if(running||!done)return;const timer=setInterval(()=>{void refreshResults();},30000);return()=>clearInterval(timer);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[running,done]);
 return <div className="form-body bulk-photo-panel"><div className="bulk-heading"><span className="bulk-symbol"><Camera size={25}/></span><div><h3>{running?'Bringing your photos in…':`${done} of ${entries.length} files uploaded`}</h3><p>{running?'Keep this page open until the uploads finish.':'Your uploaded photos are saved. Background identification can run while you’re away.'}</p></div></div>
 {selection.skipped>0&&<p className="bulk-warning">Only the first 50 files were selected. Add the other {selection.skipped} in another batch.</p>}
 <div className="bulk-progress" role="progressbar" aria-label="Files uploaded" aria-valuenow={done} aria-valuemin={0} aria-valuemax={entries.length}><span style={{width:`${entries.length?100*(done+errors)/entries.length:0}%`}}/></div>
 <div className="bulk-summary"><span>{done} uploaded</span>{errors>0&&<span className="bulk-error-count">{errors} need retrying</span>}<span>{entries.length-done-errors} remaining</span></div>
 <div className="bulk-background-note"><Sparkles size={18}/><p><strong>Identification happens in the background.</strong> The hourly ChatGPT task reads new photos and puts the results in your import inbox. You review before adding anything. If several photos show the same item, check for duplicate drafts.</p></div>
 {error&&<p role="alert" className="dialog-error">{error}</p>}
 <div className="bulk-photo-list">{entries.map(entry=>{const state=entry.result?importPhotoState(entry.result):null;return <div className="bulk-photo-row" key={entry.id}><span className="bulk-thumb"><Thumbnail file={entry.file}/></span><div className="bulk-file-info"><strong>{entry.result?.title||entry.file.name}</strong><span>{entry.status==='queued'?'Queued for upload':entry.status==='uploading'?'Uploading…':entry.status==='error'?entry.error:state==='ready'?`${entry.result?.recipe?'Recipe':entry.result?.items.length+' food item(s)'} identified`:state==='needs-review'?'Needs a closer look':state==='approved'?'Added to your kitchen':'Waiting for background identification'}</span></div>{entry.status==='uploading'?<RefreshCw className="spin" size={18}/>:entry.status==='error'?<AlertCircle size={18} className="bulk-error-count"/>:entry.status==='uploaded'?<div className="bulk-row-end">{state==='ready'||state==='approved'?<CheckCheck size={18}/>:<Clock size={18}/>}<button className="text-button" disabled={running||refreshing} onClick={()=>onReview(entry.result!)}>{state==='waiting'?'View':'Review'}<ArrowRight size={13}/></button></div>:<Clock size={17}/>}</div>;})}</div>
 <div className="form-footer bulk-footer"><button className="button secondary" disabled={running||refreshing} onClick={refreshResults}><RefreshCw size={15} className={refreshing?'spin':''}/>Check results</button>{errors>0&&<button className="button secondary" disabled={running} onClick={()=>setRetry(n=>n+1)}>Retry failed uploads</button>}<button className="button" disabled={running} onClick={onMore}><Plus size={16}/>Add more photos</button></div>
 <p className="bulk-footnote">JPG, PNG, WebP, .eml and .txt · Up to 50 files per batch · Maximum 8 MB each. Closing this panel stops files that haven’t uploaded yet; completed uploads stay saved.</p></div>;
}
