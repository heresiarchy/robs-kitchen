type Navigation={state:any;pushState:(state:any,unused:string,url?:string|URL|null)=>void;back:()=>void};
type Events={addEventListener:(type:string,listener:()=>void)=>void;removeEventListener:(type:string,listener:()=>void)=>void};
const marker='_robsKitchenModal';
export function modalHistory<T>(history:Navigation,events:Events,onChange:(value:T|null)=>void,id:string,canDismiss=()=>true){
 let current:T|null=null;
 const ownsEntry=()=>history.state?.[marker]===id;
 const push=()=>history.pushState({...history.state,[marker]:id},'');
 const pop=()=>{if(current&&!ownsEntry()){if(!canDismiss()){push();return;}current=null;onChange(null);}};
 events.addEventListener('popstate',pop);
 return {set(value:T|null){if(value!==null){if(current===null&&!ownsEntry())push();current=value;onChange(value);}else if(current!==null){current=null;onChange(null);if(ownsEntry())history.back();}},destroy(){events.removeEventListener('popstate',pop);}};
}
