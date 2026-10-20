import {
  CONSENT_COOKIE,
  CONSENT_STRICT_REGIONS,
  CONSENT_VERSION,
} from "./config"

/**
 * The inline script that establishes consent state before GTM loads.
 *
 * Order matters and is the whole point of this file. Google only honours a
 * consent default if it arrives before the tag that reads it, so this runs
 * inline during parse while gtm.js is deferred to `lazyOnload`. Getting this
 * backwards produces a page that looks compliant and isn't: the tags fire
 * first and the default lands afterwards with nothing left to gate.
 *
 * It is emitted as a string rather than a module because it must execute
 * synchronously in the document, before React hydrates.
 */
export function buildConsentBootstrap() {
  const strictRegions = JSON.stringify([...CONSENT_STRICT_REGIONS])

  // Written defensively: this runs before anything else on the page, so a
  // throw here would take the dataLayer down with it.
  return `
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
window.gtag=window.gtag||gtag;
gtag('consent','default',{
'ad_storage':'denied','ad_user_data':'denied','ad_personalization':'denied',
'analytics_storage':'denied','functionality_storage':'denied',
'personalization_storage':'denied','security_storage':'granted',
'region':${strictRegions},'wait_for_update':500});
gtag('consent','default',{
'ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted',
'analytics_storage':'granted','functionality_storage':'granted',
'personalization_storage':'granted','security_storage':'granted'});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
try{
var m=document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/);
if(m){
var c=JSON.parse(decodeURIComponent(m[1]));
if(c&&c.v===${CONSENT_VERSION}&&(c.analytics==='granted'||c.analytics==='denied')&&(c.marketing==='granted'||c.marketing==='denied')){
gtag('consent','update',{
'ad_storage':c.marketing,'ad_user_data':c.marketing,'ad_personalization':c.marketing,
'analytics_storage':c.analytics,'functionality_storage':c.analytics,
'personalization_storage':c.marketing,'security_storage':'granted'});
window.__zitroneConsent=c;
}
}
}catch(e){}
window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
`.replace(/\n/g, "")
}
