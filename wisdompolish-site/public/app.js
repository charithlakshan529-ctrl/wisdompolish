document.addEventListener('submit',async e=>{
  const f=e.target.closest('form[data-api]');if(!f)return;e.preventDefault();
  const m=f.querySelector('.msg'),b=f.querySelector('button[type=submit]');
  b.disabled=true;m.textContent='Sending…';
  try{
    const r=await fetch(f.dataset.api,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});
    const j=await r.json();m.textContent=j.message||j.error||'Done';if(r.ok)f.reset();
  }catch(_){m.textContent='Something went wrong. Please try again.'}
  b.disabled=false;
});
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-copy]');
  if(c)navigator.clipboard.writeText(c.dataset.copy).then(()=>{c.textContent='Copied!'},()=>{});
  const s=e.target.closest('[data-share]');
  if(s)navigator.share({title:s.dataset.title,url:s.dataset.share}).catch(()=>{});
});
if(navigator.share)document.querySelectorAll('[data-share]').forEach(b=>{b.hidden=false});
