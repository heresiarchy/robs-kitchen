type ScreenLock={release:()=>Promise<void>;addEventListener:(type:string,listener:()=>void,options?:{once?:boolean})=>void};
type WakeSource={request:(type:'screen')=>Promise<ScreenLock>};
type VisibleDocument={visibilityState:string;addEventListener:(type:string,listener:()=>void)=>void;removeEventListener:(type:string,listener:()=>void)=>void};
export function keepRecipeScreenAwake(doc:VisibleDocument,wakeLock:WakeSource|undefined,onChange:(active:boolean)=>void=()=>{}){
 let stopped=false,pending=false,lock:ScreenLock|null=null;
 const release=()=>{const current=lock;lock=null;onChange(false);if(current)void current.release().catch(()=>{});};
 const acquire=async()=>{
  if(stopped||pending||lock||doc.visibilityState!=='visible'||!wakeLock)return;
  pending=true;
  try{const next=await wakeLock.request('screen');if(stopped||doc.visibilityState!=='visible'){await next.release();return;}lock=next;onChange(true);next.addEventListener('release',()=>{if(lock===next){lock=null;if(!stopped)onChange(false);}},{once:true});}
  catch{if(!stopped)onChange(false);}finally{pending=false;}
 };
 const visibility=()=>{if(doc.visibilityState==='visible')void acquire();else release();};
 doc.addEventListener('visibilitychange',visibility);void acquire();
 return ()=>{stopped=true;doc.removeEventListener('visibilitychange',visibility);release();};
}
