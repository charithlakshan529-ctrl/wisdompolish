import {layout,HTML} from './_lib.js';
export async function onRequestGet({env,request}){
  const body=`<main class="page"><h1 class="h">Privacy Policy</h1>
<p>WisdomPolish respects your privacy. This page explains what we collect and why.</p>
<h2 class="h">Information you give us</h2><p>If you subscribe, we store your email address to send you new articles. If you comment, we store the name and comment you submit. We do not sell this information.</p>
<h2 class="h">Advertising and cookies</h2><p>This site may show ads from Google AdSense. Google and its partners may use cookies to show ads based on your visits to this and other sites. You can manage ad personalisation at adssettings.google.com.</p>
<h2 class="h">Contact</h2><p>To ask us to remove your email or a comment, write to the site owner using the contact details on the About page.</p></main>`;
  return new Response(layout({env,request,title:'Privacy Policy',path:'/privacy',body}),{headers:HTML});
}
