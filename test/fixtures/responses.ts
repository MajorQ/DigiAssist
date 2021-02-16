import { header, entry } from './responses_raw';

export const empty = JSON.stringify(header);

let newEntry: any = header;
newEntry.feed.entry = entry;

export const success = JSON.stringify(newEntry);








