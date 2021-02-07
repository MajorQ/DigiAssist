const search_button = document.getElementById("search");
const result = document.getElementById("result");

// TODO: add loading circle
// TODO: jump to praktikum
// TODO: icon & styling
// TODO: store last state
// TODO: maybe run in background (?)

class Praktikum {
  constructor(name, sheet_id, gid, sheet_index) {
    this.name = name;
    this.sheet_id = sheet_id;
    this.gid = gid;
    this.sheet_index = sheet_index == "" ? 2 : parseInt(sheet_index);
  }
}

// Convert column number to google sheet letter
// courtesy of https://stackoverflow.com/questions/21229180/convert-column-index-into-corresponding-column-letter
// user Pascal DeMilly
X = (n) =>
  (a = Math.floor(n / 26)) >= 0
    ? X(a - 1) + String.fromCharCode(65 + (n % 26))
    : "";

class Box {
  constructor(name, row, column, praktikum) {
    this.name = name;
    this.row = row + 2;
    this.column = X(column + 1);
    this.praktikum = praktikum;
  }
}

search_button.onclick = async function (_) {
  const input_text = document.getElementById("npmfield").value;
  const dropdown_value = document.getElementById("modul").value;

  // clear previous results
  while (result.firstChild) result.removeChild(result.firstChild);

  // fetch Master Sheet to get information on other sheets
  let entries = [];
  try {
    entries = await fetchSheet(
      "1n9B0q-SOT8q7f_jaTGjYq7WrvGxsGKwpJ4ho8V6VAZg",
      1
    );
  } catch (err) {
    let message = `Failed to access Master Sheet!`;
    console.log(message);
    showError(message);
  }

  // fetch all the other sheets
  // for every NPM match found, create a box
  let boxes = [];
  await Promise.all(
    entries.map(async (entry) => {
      let praktikum = new Praktikum(
        entry["gsx$namapraktikum"]["$t"],
        entry["gsx$sheetid"]["$t"],
        entry["gsx$gid"]["$t"],
        entry["gsx$sheetindex"]["$t"]
      );

      
      try {
        let array = await fetchSheet(praktikum.sheet_id, praktikum.sheet_index);
        let index = array.findIndex(
          (value) => value["gsx$npm"]["$t"] == input_text
        );
        if (index != -1) {
          console.log(index)
          let box = new Box(
            array[index]["gsx$nama"]["$t"],
            index,
            getColumn(array[index]["content"]["$t"], dropdown_value),
            praktikum
          );
          boxes.push(box);
        }
      } catch (error) {
        let message = `Failed to access ${praktikum.name} Sheet`;
        console.log(message);
      }
    })
  );

  // create a box for every match found, if no match then show text
  if (boxes.length != 0) {
    boxes.forEach((box) => createBox(box));
  } else {
    showError("NPM was not found!");
  }
};

// Fetch a Google Sheet given the id and index of the sheet inside the spreadsheet
// Returns a JSON object
async function fetchSheet(sheet_id, sheet_index) {
  let url = `https://spreadsheets.google.com/feeds/list/${sheet_id}/${sheet_index}/public/values?alt=json`;

  try {
    let response = await fetch(url);
    let result = await response.json();
    return result["feed"]["entry"];
  } catch (error) {
    const message = "Invalid sheet id or index!";
    throw new Error(message);
  }
}

// Show error text using HTML
function showError(message) {
  let p = document.createElement("p");
  p.innerHTML = message;
  p.style.color = "red";
  result.appendChild(p);
}

// Counts number of columns inside the Google Sheet before the given column header
function getColumn(content, header) {
  let sliceIndex = content.indexOf(header);
  let sliced = content.slice(0, sliceIndex);
  let count = (sliced.match(/: /g) || []).length;
  return count;
}

// Create a box using HTML that includes the name, praktikum, and URL
function createBox(box) {
  let div = document.createElement("div");
  div.style.border = "medium solid #000000";
  div.style.padding = "5px";
  div.style.margin = "5px 0px";
  div.onclick = function () {
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
