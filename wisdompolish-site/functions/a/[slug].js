import {layout,esc,paras,mins,fmt,PAL,HTML,adSlot,subscribeBox,origin} from '../_lib.js';
const link=t=>esc(t).replace(/https?:\/\/[^\s<]+/g,u=>`<a href="${u}" target="_blank" rel="nofollow sponsored noopener">${u}</a>`);
export async function onRequestGet({params,env,request}){
  const a=await env.DB.prepare('SELECT * FROM articles WHERE slug=?').bind(params.slug).first();
  if(!a)return new Response(layout({env,request,title:'Not found',body:'<main><h1 class="h">Article not found</h1><p><a href="/">← Back to all articles</a></p></main>'}),{status:404,headers:HTML});
  const cs=(await env.DB.prepare('SELECT name,body,created_at FROM comments WHERE article_id=? AND approved=1 ORDER BY id').bind(a.id).all()).results;
  const ids=JSON.parse(a.images||'[]'),org=origin(env,request),url=`${org}/a/${a.slug}`,ps=paras(a.body);
  const figs=ids.map(i=>`<figure><img src="/img/${i}" alt="${esc(a.title)}" loading="lazy"></figure>`).join('');
  const text=ps.map((p,i)=>`<p>${link(p)}</p>`+(i===1?adSlot(env):'')).join('')+(ps.length<2?adSlot(env):'');
  const e=encodeURIComponent(url),t=encodeURIComponent(a.title);
  const share=`<div class="actions"><button class="btn alt" data-copy="${esc(url)}">Copy link</button><button class="btn alt" data-share="${esc(url)}" data-title="${esc(a.title)}" hidden>Share</button><a class="btn alt" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?url=${e}&amp;text=${t}">X</a><a class="btn alt" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${e}">Facebook</a><a class="btn alt" target="_blank" rel="noopener" href="https://wa.me/?text=${t}%20${e}">WhatsApp</a></div>`;
  const list=cs.length?cs.map(c=>`<div class="cm"><strong>${esc(c.name)}</strong> <span class="meta">${fmt(c.created_at)}</span><p>${esc(c.body)}</p></div>`).join(''):'<p class="meta">No comments yet. Be the first.</p>';
  const form=`<form data-api="/api/comments" class="stack"><input type="hidden" name="article_id" value="${a.id}"><div class="hp" aria-hidden="true"><input name="website" tabindex="-1" autocomplete="off"></div><label for="cn">Your name</label><input id="cn" name="name" required maxlength="60" autocomplete="name"><label for="cb">Comment</label><textarea id="cb" name="body" required maxlength="1500" rows="4"></textarea><button class="btn" type="submit">Post comment</button><p class="msg" role="status"></p></form>`;
  const body=`<main><article style="--c:${PAL[a.id%5]}"><a class="back" href="/">← All articles</a><h1 class="h">${esc(a.title)}</h1><div class="meta">${fmt(a.created_at)} · ${mins(a.body)} min read</div>${figs}<div class="text">${text}</div>${share}</article>
<section class="comments"><h2 class="h">Comments</h2>${list}<h3 class="h">Leave a comment</h3><p class="meta">Comments appear after they are approved.</p>${form}</section>${subscribeBox()}</main>`;
  const ex=(ps[0]||'').slice(0,155);
  const ld={'@context':'https://schema.org','@type':'Article',headline:a.title,datePublished:a.created_at.replace(' ','T')+'Z',author:{'@type':'Organization',name:'WisdomPolish'},mainEntityOfPage:url,...(ids[0]?{image:`${org}/img/${ids[0]}`}:{})};
  return new Response(layout({env,request,title:a.title,desc:ex,path:'/a/'+a.slug,body,ld,image:ids[0]?`${org}/img/${ids[0]}`:''}),{headers:HTML});
}
