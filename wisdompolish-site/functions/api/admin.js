import {isAdmin,json} from '../_lib.js';
const DATAURL=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
const slugify=s=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'article';
export async function onRequestPost({request,env}){
  if(!isAdmin(request,env))return json({error:'Wrong password'},401);
  let b;try{b=await request.json()}catch(_){return json({error:'Bad request'},400)}
  const db=env.DB,id=Number(b.id)||0;
  switch(b.action){
    case 'list':{
      const articles=(await db.prepare('SELECT id,slug,title,body,created_at FROM articles ORDER BY id DESC LIMIT 200').all()).results;
      const comments=(await db.prepare('SELECT c.id,c.name,c.body,c.approved,c.created_at,a.title FROM comments c LEFT JOIN articles a ON a.id=c.article_id ORDER BY c.approved ASC,c.id DESC LIMIT 200').all()).results;
      const subscribers=(await db.prepare('SELECT email,created_at FROM subscribers ORDER BY created_at DESC').all()).results;
      return json({articles,comments,subscribers});
    }
    case 'create':{
      const title=String(b.title||'').trim().slice(0,200),body=String(b.body||'').trim().slice(0,50000);
      if(!title||!body)return json({error:'Title and article are required'},400);
      const imgs=Array.isArray(b.images)?b.images.slice(0,6):[];
      for(const d of imgs)if(typeof d!=='string'||d.length>1500000||!DATAURL.test(d))return json({error:'Invalid image'},400);
      const ids=[];
      for(const d of imgs)ids.push((await db.prepare('INSERT INTO images(data) VALUES(?)').bind(d).run()).meta.last_row_id);
      let slug=slugify(title);
      if(await db.prepare('SELECT 1 FROM articles WHERE slug=?').bind(slug).first())slug+='-'+Math.random().toString(36).slice(2,6);
      await db.prepare('INSERT INTO articles(slug,title,body,images) VALUES(?,?,?,?)').bind(slug,title,body,JSON.stringify(ids)).run();
      return json({ok:true,slug});
    }
    case 'update':{
      const title=String(b.title||'').trim().slice(0,200),body=String(b.body||'').trim().slice(0,50000);
      if(!title||!body)return json({error:'Title and article are required'},400);
      await db.prepare('UPDATE articles SET title=?,body=? WHERE id=?').bind(title,body,id).run();
      const a=await db.prepare('SELECT slug FROM articles WHERE id=?').bind(id).first();
      return a?json({ok:true,slug:a.slug}):json({error:'Not found'},404);
    }
    case 'delete':{
      const a=await db.prepare('SELECT images FROM articles WHERE id=?').bind(id).first();
      if(!a)return json({error:'Not found'},404);
      const ids=JSON.parse(a.images||'[]').map(Number).filter(Boolean);
      const st=[db.prepare('DELETE FROM comments WHERE article_id=?').bind(id),db.prepare('DELETE FROM articles WHERE id=?').bind(id)];
      if(ids.length)st.push(db.prepare(`DELETE FROM images WHERE id IN (${ids.map(()=>'?').join(',')})`).bind(...ids));
      await db.batch(st);return json({ok:true});
    }
    case 'comment_approve':await db.prepare('UPDATE comments SET approved=1 WHERE id=?').bind(id).run();return json({ok:true});
    case 'comment_delete':await db.prepare('DELETE FROM comments WHERE id=?').bind(id).run();return json({ok:true});
    default:return json({error:'Unknown action'},400);
  }
}
