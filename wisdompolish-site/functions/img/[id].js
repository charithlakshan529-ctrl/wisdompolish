export async function onRequestGet({params,env}){
  const r=await env.DB.prepare('SELECT data FROM images WHERE id=?').bind(Number(params.id)||0).first();
  const m=r&&/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(r.data);
  if(!m)return new Response('Not found',{status:404});
  const bin=atob(m[2]),u=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
  return new Response(u,{headers:{'content-type':m[1],'cache-control':'public, max-age=31536000, immutable'}});
}
