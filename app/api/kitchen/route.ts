import {env} from 'cloudflare:workers';
import {dispatch} from '@/lib/kitchen-service';
import {requestOwner,assertSameOrigin,errorResponse,KitchenError,readBounded} from '@/lib/kitchen-security';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const result=await dispatch(env.DB!,requestOwner(request),'get_kitchen',{});return Response.json(result,{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{const owner=requestOwner(request);assertSameOrigin(request);const text=new TextDecoder().decode(await readBounded(request,300000));const body=JSON.parse(text);if(['get_import_attachment','save_upload'].includes(body.action))throw new KitchenError('Use the attachment endpoint.');const result=await dispatch(env.DB!,owner,body.action,body.args);if(result.cleanupKeys){await env.BUCKET!.delete(result.cleanupKeys.filter((key:string)=>key.startsWith(owner+'/')));delete result.cleanupKeys;}return Response.json(result,{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
