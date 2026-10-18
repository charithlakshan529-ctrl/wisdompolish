import {layout,esc,paras,mins,fmt,PAL,HTML,subscribeBox} from './_lib.js';
export async function onRequestGet({request,env}){
  const q=(new URL(request.url).searchParams.get('q')||'').trim().slice(0,80);
  let st;
  if(q){
    const like='%'+q.replace(/[%_\\]/g,'\\$&')+'%';
    st=env.DB.prepare("SELECT id,slug,title,body,images,created_at FROM articles WHERE title LIKE ?1 ESCAPE '\\' OR body LIKE ?1 ESCAPE '\\' ORDER BY id DESC LIMIT 50").bind(like);
  }else st=env.DB.prepare('SELECT id,slug,title,body,images,created_at FROM articles ORDER BY id DESC LIMIT 50');
  const rows=(await st.all()).results;
  const cards=rows.map(a=>{
    const im=JSON.parse(a.images||'[]')[0],ex=(paras(a.body)[0]||'').slice(0,140);
    return `<a class="card" href="/a/${esc(a.slug)}" style="--c:${PAL[a.id%5]}"><div class="ct"><h2 class="h">${esc(a.title)}</h2><p>${esc(ex)}${ex.length>=140?'…':''}</p><span class="meta">${fmt(a.created_at)} · ${mins(a.body)} min read</span></div>${im?`<img src="/img/${im}" alt="" loading="lazy">`:''}</a>`;
  }).join('');
  const empty=q?`<p class="none">No articles match “${esc(q)}”. <a href="/">Show all articles</a></p>`:'<p class="none">No articles yet. Please check back soon.</p>';
  const body=`<main><section class="hero"><h1 class="h">Ideas worth sharpening.</h1><p>Articles on knowledge, learning and clear thinking.</p>
<form action="/" method="get" role="search" class="inline"><label class="sr" for="q">Search articles</label><input id="q" type="search" name="q" value="${esc(q)}" placeholder="Search articles"><button class="btn" type="submit">Search</button></form></section>
${q?`<p class="meta">${rows.length} result${rows.length===1?'':'s'} for “${esc(q)}”</p>`:''}${cards||empty}${q?'':subscribeBox()}</main>`;
  return new Response(layout({env,request,path:'/',body}),{headers:HTML});
}
