# Game Cloud Sync

A quick tool for syncing a game's save data to your personal cloud storage (e.x Dropbox). Built in Javascript using Electron to be a desktop app.

Currently in-progress; goal is to have manual cloud syncing first and then build up to auto syncing when games open/close. As a Steam Deck, owner I thought this would be a simple and very useful tool to have.

# Current Progress

The app has currently not yet reached functionality.
Features:
* Add file
* Program shows file metadata in your saved list

Current Bugs:
* After adding two files, on the third one it duplicates the first file
* Uncaught (in promise) TypeError: Failed to fetch; oops???

TODO:
* Make program remember which files you have added to it on refresh
* Program syncing directories for games that have changing save file names
* Connect file functionality to Dropbox
* Figure out how to add a file smoothly on a second computer when you have already uploaded it on a first computer
* Add ability to upload/pull files from Dropbox

Future Extra Features:
* Auto-sync files on startup depending on whether local/cloud file is newer
    * Auto-sync files upon opening/closing game
* Ability to specify which game a save file is for
    * Auto-detect games

# Instructions

1. Install node.js with node package manager included
2. Clone repository
3. Run `npm install` to install dependencies
4. Run `npm start` to initialize the program
5. Click the 'Choose File' button and upload a file to see it appear on your list

