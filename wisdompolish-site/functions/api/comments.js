import {json} from '../_lib.js';
export async function onRequestPost({request,env}){
  let b;try{b=await request.json()}catch(_){return json({error:'Bad request'},400)}
  if(b.website)return json({message:'Thank you! Your comment will appear after approval.'});
  const name=String(b.name||'').trim().slice(0,60),body=String(b.body||'').trim().slice(0,1500),id=Number(b.article_id)||0;
  if(!name||!body)return json({error:'Please add your name and a comment.'},400);
  if(!await env.DB.prepare('SELECT 1 FROM articles WHERE id=?').bind(id).first())return json({error:'Article not found.'},404);
  await env.DB.prepare('INSERT INTO comments(article_id,name,body) VALUES(?,?,?)').bind(id,name,body).run();
  return json({message:'Thank you! Your comment will appear after approval.'});
}
