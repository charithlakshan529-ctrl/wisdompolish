export const PAL=['#FF7A1A','#00A896','#D6336C','#6C3FC5','#1C8EF0'];
export const HTML={'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=60'};
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
export const paras=b=>String(b).split(/\n\s*\n/).map(p=>p.trim()).filter(Boolean);
export const mins=b=>Math.max(1,Math.round(String(b).split(/\s+/).length/200));
export const fmt=s=>new Date(String(s).replace(' ','T')+'Z').toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'});
export const origin=(env,request)=>(env.SITE_URL||new URL(request.url).origin).replace(/\/$/,'');

export function isAdmin(req,env){
  const k=req.headers.get('x-admin-key')||'',p=env.ADMIN_PASSWORD||'';
  if(!p||k.length!==p.length)return false;
  let d=0;for(let i=0;i<k.length;i++)d|=k.charCodeAt(i)^p.charCodeAt(i);
  return d===0;
}

export function adSlot(env){
  if(!env.ADSENSE_CLIENT||!env.ADSENSE_SLOT)return '';
  return `<div class="ad"><small>Advertisement</small><ins class="adsbygoogle" style="display:block" data-ad-client="${esc(env.ADSENSE_CLIENT)}" data-ad-slot="${esc(env.ADSENSE_SLOT)}" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;
}

export const subscribeBox=()=>`<section class="box"><h2 class="h">Get new articles by email</h2><p>One short email when a new article is published.</p><form data-api="/api/subscribe" class="inline"><label class="sr" for="em">Email address</label><input id="em" name="email" type="email" required placeholder="you@example.com" autocomplete="email"><button class="btn" type="submit">Subscribe</button><p class="msg" role="status"></p></form></section>`;

export function layout(o){
  const {env,request}=o,org=origin(env,request),url=org+(o.path||'/');
  const t=esc(o.title?o.title+' · WisdomPolish':'WisdomPolish — Ideas worth sharpening');
  const d=esc(o.desc||'Articles on knowledge, learning and clear thinking.');
  const ads=env.ADSENSE_CLIENT?`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(env.ADSENSE_CLIENT)}" crossorigin="anonymous"></script>`:'';
  const ld=o.ld?`<script type="application/ld+json">${JSON.stringify(o.ld).replace(/</g,'\\u003c')}</script>`:'';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${esc(url)}">
<meta property="og:site_name" content="WisdomPolish"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:type" content="${o.ld?'article':'website'}"><meta property="og:url" content="${esc(url)}">
${o.image?`<meta property="og:image" content="${esc(o.image)}"><meta name="twitter:card" content="summary_large_image">`:'<meta name="twitter:card" content="summary">'}
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">${ads}${ld}</head><body>
<header class="top"><a class="logo h" href="/"><span class="dots"><i style="background:#FF7A1A"></i><i style="background:#00A896"></i><i style="background:#D6336C"></i></span>WisdomPolish</a><nav><a href="/">Articles</a><a href="/about">About</a></nav></header>
<div class="stripe"></div>
${o.body}
<footer><a href="/about">About</a> · <a href="/privacy">Privacy</a> · © ${new Date().getUTCFullYear()} WisdomPolish</footer>
<script src="/app.js" defer></script></body></html>`;
}
