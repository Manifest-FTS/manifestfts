import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

// AI traffic snippet: one landing per browser session, no cookies, no personal data.
// Sends only the referrer, the landing path, utm_source, and the page host.
const SCRIPT = `(function(){try{var s=document.currentScript,k=s&&s.getAttribute("data-key");if(!k||navigator.globalPrivacyControl)return;try{if(sessionStorage.getItem("sg_l"))return;sessionStorage.setItem("sg_l","1")}catch(_){}var q=new URLSearchParams(location.search),d=JSON.stringify({k:k,r:document.referrer||"",p:location.pathname,u:q.get("utm_source"),h:location.hostname}),e=${JSON.stringify(absoluteUrl('/api/t'))};if(navigator.sendBeacon){navigator.sendBeacon(e,d)}else{fetch(e,{method:"POST",body:d,keepalive:true,mode:"no-cors"})}}catch(_){}})();`;

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
