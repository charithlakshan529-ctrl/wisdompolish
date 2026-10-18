import {layout,HTML} from './_lib.js';
export async function onRequestGet({env,request}){
  const body=`<main class="page"><h1 class="h">About WisdomPolish</h1><p>WisdomPolish is a place for clear, practical articles about knowledge, learning and thinking well. New articles are published regularly, and you are welcome to comment and share.</p><p>Questions or ideas? Leave a comment under any article.</p></main>`;
  return new Response(layout({env,request,title:'About',path:'/about',body}),{headers:HTML});
}
