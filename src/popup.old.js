// TODO: jump to praktikum
// TODO: icon & styling
// TODO: scrollable html
// TODO: store last state
// TODO: migrate code to TypeScript & webextension-polyfill

// =============================================================================
// Declaration
// =============================================================================

// Convert column number to google sheet letter
// https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
X = (n) =>
  (a = Math.floor(n / 26)) >= 0
    ? X(a - 1) + String.fromCharCode(65 + (n % 26))
    : "";

class Praktikum {
  constructor(name, sheet_id, gid, data) {
    this.name = name;
    this.sheet_id = sheet_id;
    this.gid = gid;
    this.data = data;
  }
}

class Box {
  constructor(name, row, column, praktikum) {
    this.name = name;
    this.row = row + 2;
    this.column = X(column + 1);
    this.praktikum = praktikum;
  }
}

const search_button = document.getElementById("search_button");
const praktikum_dropdown = document.getElementById("praktikum_dropdown");
const result = document.getElementById("result");
const popup_loading = document.getElementById("popup_loading");
const popup_body = document.getElementById("popup_body");
const date = document.getElementById("date");
const refresh_button = document.getElementById("refresh_button");


// =============================================================================
// Actual Code
// =============================================================================
let praktikumList = [];
main();

async function main() {

  toggleLoading(popup_body, popup_loading);

  // get the data
  try {
    chrome.storage.local.get(["cache", "cacheTime"], async (data) => {
      if (Date.now() - data.cacheTime > 3600 * 1000) {

        praktikumList = await fetchAllSheets();
        chrome.storage.local.set({
          cache: praktikumList,
          cacheTime: Date.now(),
        }, () => {
          date.innerHTML = `Last Update: ${Date(Date.now())}`;
          createPraktikumDropdown(praktikumList);
          toggleLoading(popup_body, popup_loading);
        });
      } else {
        date.innerHTML = `Last Update: ${Date(data.cacheTime)}`;
        praktikumList = data.cache;
        createPraktikumDropdown(praktikumList);
        toggleLoading(popup_body, popup_loading);
      }
    });
  } catch (error) {
    praktikumList = await fetchAllSheets();
    chrome.storage.local.set({
      cache: praktikumList,
      cacheTime: Date.now(),
    }, () => {
      date.innerHTML = `Last Update: ${Date(Date.now())}`;
      createPraktikumDropdown(praktikumList);
      toggleLoading(popup_body, popup_loading);
    });
  }
}

search_button.onclick = async (_) => {

  const input_npm = document.getElementById("npm_text_field").value;
  const modul = document.getElementById("modul_dropdown").value;
  const praktikum_value = praktikum_dropdown.value;

  // clear previous results
  while (result.firstChild) result.removeChild(result.firstChild);

  let boxes = [];
  let search_list = praktikumList;
  if (praktikum_value != "") {
    const selected_index = praktikumList.findIndex((praktikum) => praktikum.name === praktikum_value);
    search_list = [praktikumList[selected_index]];
  }

  search_list.forEach((praktikum) => {
    const data = praktikum.data;
    const index = data.findIndex((data) => data["gsx$npm"]["$t"] === input_npm);
    if (index != -1) {
      const box = new Box(
        data[index]["gsx$nama"]["$t"],
        index,
        getColumn(data[index]["content"]["$t"], modul),
        praktikum
      );
      boxes.push(box);
    }
  });

  // create a box for every match found, if no match then show text
  if (boxes.length != 0) {
    boxes.forEach((box) => createResultBox(box));
  } else {
    showError("NPM was not found!");
  }
};

refresh_button.onclick = async (_) => {
  toggleLoading(popup_body, popup_loading);

  praktikumList = await fetchAllSheets();
  chrome.storage.local.set({
    cache: praktikumList,
    cacheTime: Date.now(),
  }, () => {
    date.innerHTML = `Last Update: ${Date(Date.now())}`;
    createPraktikumDropdown(praktikumList);
    toggleLoading(popup_body, popup_loading);
  });
};

// =============================================================================
// Logic Functions
// =============================================================================

// Fetch a Google Sheet given the id and index of the sheet inside the spreadsheet
// Returns a JSON object
async function fetchSheet(sheet_id, sheet_index) {
  let url = `https://spreadsheets.google.com/feeds/list/${sheet_id}/${sheet_index}/public/values?alt=json`;

  try {
    let response = await fetch(url);
    let result = await response.json();
    return result["feed"]["entry"];
  } catch (error) {
    throw error.message;
  }
}

async function fetchAllSheets() {

  let entries = [];
  let list = [];

  // fetch Master Sheet
  try {
    entries = await fetchSheet(
      "1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg",
      1
    );
  } catch {
    const message = `Failed to access Master Sheet!`;
    showError(message); // TODO: doesn't work lmao
    throw Error(message);
  }

  // fetch all the other sheets
  await Promise.all(
    entries.map(async (entry) => {
      const name = entry["gsx$namapraktikum"]["$t"];
      const sheet_index = (entry["gsx$sheetindex"]["$t"] === "") ? 2 : parseInt(entry["gsx$sheetid"]["$t"]);
      const sheet_id = entry["gsx$sheetid"]["$t"];
      try {
        const array = await fetchSheet(sheet_id, sheet_index);
        list.push(new Praktikum(
          name,
          sheet_id,
          entry["gsx$gid"]["$t"],
          array,
        ));
      } catch {
        const message = `Failed to access ${name} Sheet!`;
        showError(message);
        console.error(message);
      }
    })
  );

  return list;
}

// Counts number of columns inside the Google Sheet before the given column header
function getColumn(content, header) {
  let sliceIndex = content.indexOf(header);
  let sliced = content.slice(0, sliceIndex);
  let count = (sliced.match(/: /g) || []).length;
  return count;
}

// =============================================================================
// UI Functions
// =============================================================================

function createPraktikumDropdown(list) {

  if (list == undefined) return;

  // sort list of praktikum then
  list.sort((a, b) => {
    if (a.name < b.name) { return -1; }
    if (a.name > b.name) { return 1; }
    return 0;
  });

  // create the praktikum dropdown options
  list.forEach((praktikum) => {
    let option = document.createElement("option");
    option.innerHTML = praktikum.name;
    option.value = praktikum.name;
    praktikum_dropdown.appendChild(option);
  });
}

// Show error text using HTML
function showError(message) {
  let p = document.createElement("p");
  p.innerHTML = message;
  p.style.color = "red";
  result.appendChild(p);
}

function toggleLoading(object_id, loading_id) {
  if (object_id.style.display === "none") {
    loading_id.style.display = "none";
    object_id.style.display = "block";
  } else {
    object_id.style.display = "none";
    loading_id.style.display = "block";
  }
}

// Create a box using HTML that includes the name, praktikum, and URL
function createResultBox(box) {
  let div = document.createElement("div");
  div.style.border = "medium solid #000000";
  div.style.padding = "5px";
  div.style.margin = "5px 0px";
  div.onclick = () => {
    chrome.tabs.create({
      url: `https://docs.google.com/spreadsheets/d/${box.praktikum.sheet_id}/edit#gid=${box.praktikum.gid}&range=${box.column}${box.row}`,
    });
  };

  let student_name = document.createElement("u");
  student_name.innerHTML = box.name;
  student_name.style.fontWeight = "bold";
  div.appendChild(student_name);

  let prak_name = document.createElement("p");
  prak_name.innerHTML = box.praktikum.name;
  div.appendChild(prak_name);

  result.appendChild(div);
}
