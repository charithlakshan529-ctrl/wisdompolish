import {origin} from './_lib.js';
export async function onRequestGet({env,request}){
  const o=origin(env,request),rs=(await env.DB.prepare('SELECT slug,created_at FROM articles ORDER BY id DESC LIMIT 1000').all()).results;
  const u=rs.map(a=>`<url><loc>${o}/a/${a.slug}</loc><lastmod>${a.created_at.slice(0,10)}</lastmod></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${o}/</loc></url>${u}</urlset>`,{headers:{'content-type':'application/xml','cache-control':'public, max-age=3600'}});
}
