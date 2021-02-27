# DigiAssist
> An extension to help Digital Lab Assistant find their student for grading.

## Table of contents
- [DigiAssist](#digiassist)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Screenshots](#screenshots)
  - [Changing link sheet URL](#changing-link-sheet-url)
  - [Features](#features)
  - [Status](#status)
  - [Known bugs](#known-bugs)
  - [Technologies](#technologies)
  - [Contact](#contact)

## Installation
1. Download DigiAssist and extract the latest release from this repository
2. Go to `chrome://extensions/`
3. Choose `Load unpacked`
4. Select the `dist/` folder from the download
5. Enjoy!

## Screenshots
![Example screenshot](/screenshots/popup.PNG?raw=true)

## Changing link sheet URL
You would need to change this URL every semester to get a new batch of practicum.
> Open [`src/popup.ts`](src/popup.ts) and change linkSheetID string literal

## Features
List of features ready:
* Search for a student. 
* Go to a specific practicum by leaving the NPM field blank.
* Fast cache to store data.

To-do list:
* Go straight to a module using the dropdown
* Testing!
  * Test cache fetch and store
  * Test repository
  * Test search use case

## Status
Project is: _ongoing_.

## Known bugs
None as of yet.

## Contact
Created by Salman - feel free to contact via email at mohammadalfarisi00@gmail.com!
