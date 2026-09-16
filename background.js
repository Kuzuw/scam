// Manifest V3 service worker.
// Differences from the MV2 version:
//  - XMLHttpRequest is not available in service workers, so fetch() is used instead
//    (credentials: 'include' keeps the cookie behaviour the XHR had).
//  - The invalid "SameSiteStatus" key was replaced with "sameSite"; MV3 rejects unknown keys.
//  - Only messages we handle keep the response channel open.

const api = typeof chrome !== 'undefined' ? chrome : browser; // eslint-disable-line no-undef

const ONE_YEAR_FROM_NOW = () => Math.floor((Date.now() + 31536e6) / 1000);

const handlers = {
  forceLogout: (_data, sendResponse) => {
    api.cookies.remove({
      url: 'https://api-auth.soundcloud.com/connect/',
      name: '_soundcloud_session',
    }, () => sendResponse(true));
  },

  getCookie: (data, sendResponse) => {
    api.cookies.get({
      url: 'https://soundcloud.com/',
      name: data.name,
    }, (cookie) => sendResponse(cookie));
  },

  setCookie: (data, sendResponse) => {
    api.cookies.set({
      url: 'https://soundcloud.com/',
      name: data.name,
      value: data.value,
      secure: true,
      expirationDate: ONE_YEAR_FROM_NOW(),
    }, (cookie) => sendResponse(cookie));
  },

  removeCookie: (data, sendResponse) => {
    api.cookies.remove({
      url: 'https://soundcloud.com/',
      name: data.name,
    }, (details) => sendResponse(details));
  },

  validateCookie: (data, sendResponse) => {
    fetch('https://api-auth.soundcloud.com/connect/session', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ session: { access_token: data.cookie } }),
    })
      .then((res) => sendResponse(res.status === 200))
      .catch(() => sendResponse(false));
  },

  refreshCookie: (data, sendResponse) => {
    const fetchNewCookie = () => {
      fetch('https://api-auth.soundcloud.com/connect/session/token', {
        method: 'POST',
        credentials: 'include',
        body: 'null',
      })
        .then((res) => (res.status === 200 ? res.json() : null))
        .then((json) => sendResponse(json ? json.session.access_token : null))
        .catch(() => sendResponse(null));
    };

    if (data && data.cookie) {
      api.cookies.set({
        url: 'https://api-auth.soundcloud.com/connect/',
        name: '_soundcloud_session',
        value: data.cookie,
        secure: true,
        sameSite: 'no_restriction',
      }, () => fetchNewCookie());
    } else fetchNewCookie();
  },
};

api.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const handler = request && handlers[request.method];
  if (!handler) return false;
  handler(request.data || {}, sendResponse);
  return true; // async response
});
