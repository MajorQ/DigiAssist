import { browser } from "webextension-polyfill-ts"
import  * as _ from "lodash"
import  * as func from"./functions"

const search_button = document.getElementById('search_button');
const refresh_button = document.getElementById('refresh_button');

document.addEventListener('DOMContentLoaded', async () => {
    var a = await browser.storage.local.get('unknown');

    if (_.isEmpty(a)) {
        // const data = await func.fetchSheet('1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg-', 1);
        const data = await func.fetchSheet('1gy9XBOyANahh12NYR1vK9cHMYQrhRkdysh15BpqzWLQ', 3);
        // console.log(data);
    }
});

search_button.addEventListener('click', async () => {
    console.log('click lmao');
});

refresh_button.addEventListener('click', async () => {

});

