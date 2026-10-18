import {origin} from './_lib.js';
export async function onRequestGet({env,request}){
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: ${origin(env,request)}/sitemap.xml\n`,{headers:{'content-type':'text/plain'}});
}
