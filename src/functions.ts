import { ServerError } from "./classes/error"
export { fetchSheet }

async function fetchSheet(sheet_id : string, sheet_index : number): Promise<ServerError | Object[]> {
    const url = `https://spreadsheets.google.com/feeds/list/${sheet_id}/${sheet_index}/public//values?alt=json`;

    const response = await fetch(url);

    // return [{}];

    console.log(response);

    // if (!response.ok) {
    //     return new ServerError(
    //         response.status,
    //         response.statusText,
    //     );
        
    // }

    const result = await response.json();

    console.log(result);
    
    return [{}];
    
    // // remove the sheet headers and only return the values inside the sheet
    // // if there are no values return empty Array
    // return result['feed']['entry'] ?? [];
}
