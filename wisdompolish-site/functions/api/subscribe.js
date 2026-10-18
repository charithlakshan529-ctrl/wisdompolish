import {json} from '../_lib.js';
export async function onRequestPost({request,env}){
  let b;try{b=await request.json()}catch(_){return json({error:'Bad request'},400)}
  const e=String(b.email||'').trim().toLowerCase().slice(0,120);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e))return json({error:'Please enter a valid email address.'},400);
  await env.DB.prepare('INSERT OR IGNORE INTO subscribers(email) VALUES(?)').bind(e).run();
  return json({message:'Thank you! You are subscribed.'});
}
