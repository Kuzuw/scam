# scam (mv3)
[![airbnb eslint style](https://img.shields.io/static/v1?label=code%20style&message=airbnb&color=success&style=flat-square)](https://github.com/airbnb/javascript)
[![mit licensed](https://img.shields.io/static/v1?label=license&message=mit&color=success&style=flat-square)](LICENSE.md)

> this is a manifest v3 port of [sad/scam](https://github.com/sad/scam). all credit for the original extension goes to its author.

**scam** (the **soundcloud account manager**) is a simple account switching extension for [SoundCloud](https://soundcloud.com). new accounts are automatically added every time you log in. you can find them under the username dropdown.

the original version is built on manifest v2, which chrome no longer supports. this fork updates it to manifest v3 so it keeps working on modern chromium browsers.

### what changed
- `manifest.json` updated to manifest v3 (service worker background, `host_permissions`)
- `XMLHttpRequest` calls in the background script replaced with `fetch`, since service workers don't support xhr
- fixed an invalid `SameSiteStatus` cookie option (now `sameSite`), which manifest v3 rejects
- the content scripts (`switcher.js`, `login.js`) are unchanged

### installation
this version isn't on the chrome web store, so you'll need to load it manually:

1. download this repo (**code → download zip**) and extract it
2. go to `chrome://extensions`
3. enable **developer mode** (top right)
4. click **load unpacked** and select the extracted folder

works on chrome, edge, brave, opera and other chromium-based browsers. firefox isn't supported by this fork — use the [original addon](https://addons.mozilla.org/en-US/firefox/addon/scam/) there.

if you already used the original extension, your saved accounts will carry over, since they're stored in soundcloud's local storage rather than the extension itself. remove the old version before installing this one.

### usage tips
- to add another account, use **add account** in the username dropdown. **don't** use soundcloud's own sign out button — it invalidates the session on soundcloud's side and the saved account will stop working.
- if an account stops working, just log into it again and it will be re-saved.

### contributing
pull requests welcome. please use `yarn` or your favourite package manager to install the airbnb eslint base after cloning the repo.

<p align="center">
  <img alt="Preview" src="https://i.imgur.com/BKXKIEe.png"/>
</p>
