import { browser } from "webextension-polyfill-ts";

browser.storage.local.get('unknownKey').then(console.log)
