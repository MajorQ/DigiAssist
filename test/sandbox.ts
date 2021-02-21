import { browser } from "webextension-polyfill-ts";

main()

async function main() {

    await browser.storage.local.set({key1: 1, key2: 2})

    console.log(await browser.storage.local.get(['key1', 'key2']));
    

}

