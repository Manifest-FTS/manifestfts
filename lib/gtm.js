export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const pushToDataLayer = (payload) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

export const pageview = (url) => {
  pushToDataLayer({
    event: 'pageview',
    page: url,
  });
};

export const trackEvent = (event, payload = {}) => {
  pushToDataLayer({
    event,
    ...payload,
  });
};