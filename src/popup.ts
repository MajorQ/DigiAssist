import { browser } from "webextension-polyfill-ts"

const search_button = document.getElementById('search_button');

document.addEventListener('DOMContentLoaded', async () => {
    var a = await browser.storage.local.get('unknown');

    if (Object.keys(a).length == 0) {
        console.log('it\'s empty');
    }
});

search_button.addEventListener('click', () => {
    console.log('yes');
});


