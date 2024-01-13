const { Dropbox } = require('dropbox')
const { webContents } = require('electron')
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { listenerCount } = require('process')
const fs = require('fs')
//const electron_data = require('electron-data');


//const os = require('os');
const storage = require('electron-json-storage');
const db = require('electron-db');
const rootPath = require('electron-root-path').rootPath;
const location = path.join(rootPath, 'package.json');
const pkgInfo = fs.readFileSync(location, { encoding: 'utf8' });
const jsonConverter = require("json-array-converter");
//const eStorage = require('electron-store');

const defaultDataPath = storage.getDefaultDataPath();
storage.setDataPath(rootPath + '/config');

const dataPath = storage.getDataPath();
console.log(dataPath);


function json2array(json) {
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function (key) {
        result.push(json[key]);
    });
    return result;
}

function setGame(name, path) {

    newData = [
        {
            "name": name,
            "path": path
        }
    ];
    storage.get('Games', (error, data) => {
        if (error) throw error;
        data = json2array(data);
        data.push(newData);
        storage.set('Games', data, (err) => { if (err) throw err });
    });

}



//setGame("Diablo 7", "path_to_game"); //добавление игры в конфиг










const location_db = path.join(__dirname + '/config', '')
//storage.setDataPath(rootPath + '/config');
db.createTable('test-games', location_db, (succ, msg) => {
    // succ - логическое значение, сообщает, успешен ли вызов
    if (succ) {
        console.log(msg)
    } else {
        console.log('Err. ' + msg)
    }
})


let obj = new Object();

obj.name = "12335r25";
obj.address = "sdfgasfas asfsaf asfaf";

if (db.valid('test-games', location_db)) {
    db.insertTableContent('test-games', location_db, obj, (succ, msg) => {
        // succ - boolean, tells if the call is successful
        console.log("Success: " + succ);
        console.log("Message: " + msg);
    })
}




/*
function addslashes(str) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
*/

//var data = new google.visualization.DataTable();
//data.addColumn('string', 'Topping');
//data.addColumn('number', 'Slices');
//data.addRows(result);

//  [{"device_id":"9700015","update_time":"2017-01-04 18:30:00","sensor_value":"1287.6"}, {"device_id":"9700016","update_time":"2016-12-31 18:30:00","sensor_value":"1113.8"}]

/*storage.get('Games', function (error, data) {
    if (error) throw error;
    data = json2array(data);
    return data;
});

*/
/*
storage.get('Games', function (error, data) {
    if (error) throw error;
    data = json2array(data);
    console.log(data);
});

*/
/*

storage.get('Games', function (error, data) {
    if (error) throw error;
    newData = data;
    data.push(newData);
    data = json2array(data);
    storage.set('Games', data, (err) => { if (err) throw err });
    console.log(data);
});
*/


storage.get('Games', function (error, data) {
    if (error) throw error;
    // data = json2array(data);
    //  console.log(data);
});



/*
storage.get('Games', function (error, data) {
    if (error) throw error;
    data = json2array(data);
    console.log(data);
});
*/

storage.keys(function (error, keys) {
    if (error) throw error;
    console.log("konfig keys: ");
    for (var key of keys) {
        console.log('key: ' + key);
    }
});




function getJson(json) {
    var result = [];
    storage.get(json, function (error, data, result) {
        if (error) throw error;

        data = json2array(data);
        //console.log(data);
        result = data;
        return data;

    })
    //console.log(result);
    return result;

}

let aaa = getJson('Games');
//console.log(aaa);





function copyGameFiles(src, dest) {
    try {
        fs.cpSync(src, dest, {
            recursive: true,
        });
    } catch (error) {
        //  console.log(error.message);
    }
}

//copyGameFiles("D:/DEV/MY/Electron/game-cloud-sync-main/test/", "D:/DEV/MY/Electron/game-cloud-sync-main/test2/")

// File destination.txt will be created or overwritten by default.
/*fs.copyFile(test, test2, (err) => {
    if (err) throw err;
    console.log('tesxt.txt was copied to destination.txt');
});*/




/*
storage.set('games', {
    0: {
        name: 'Diablo 1',
        path: 'path_to_game'
    },
    1: {
        name: 'Diablo 2',
        path: 'path_to_game'
    }
}, function (error) {
    if (error) throw error;
});
*/



/*

electron_data.config({
    filename: 'game_config',
    path: rootPath + '/config'
});
*/
/*
electron_data.getOptions()
    .then(options => {
       cleconsole.log(options);
       
        {
          filename: 'example',
     path: '/my/awesome/directory',
     autosave: false,
     prettysave: false,
     lastUpdate: false
        }
        
    });
*/
// Store a key => value

/*electron_data.set('Games', { 0: { 'name': 'Diablo 2', 'path': 'path_to_game' }, 1: { 'name': 'Diablo 3', 'path': 'path_to_game' } })
    .then(data => {
        console.log(data); // {'games_list': { 'game_name': 'path_to_save' }}
        electron_data.save()
            .then(error => {
                console.log(error); // undefined
            });
    });*/
/*
electron_data.getAll().then(value => {
console.log(value); // true
});
*/
/*
electron_data.has('Games')
    .then(has_key => {
        console.log(has_key); // true
    });


electron_data.get('Games')
    .then(value => {
        // console.log(value); // {'awesome': 'module'}
        /*electron_data.set('Games', { value, 2: { 'name': 'Diablo 4', 'path': 'path_to_game' }, 3: { 'name': 'Diablo 5', 'path': 'path_to_game' } })
            .then(data => {
                console.log(data); // {'games_list': { 'game_name': 'path_to_save' }}
            });*/
//   });



/*
electron_data.set('my-prop', { 'awesome': 'module2' })
    .then(data => {
        console.log(data); // {'awesome': 'module'}
    });
*/
// Save the data to a JSON file
/*electron_data.save()
    .then(error => {
        //console.log(error); // undefined
    });
*/
// Check if the data has a value for "my-prop"
/*electron_data.has('my-prop')
    .then(has_key => {
        //console.log(has_key); // true
    });
*/
// Get the value for "my-prop"
/*electron_data.get('my-prop')
    .then(value => {
        //console.log(value); // {'awesome': 'module'}
    });
*/
// Remove "my-prop"
/*electron_data.unset('my-prop')
    .then(deleted => {
        //console.log(deleted); // true
    });
*/
// Clear all data
/*electron_data.clear()
    .then(data => {
        console.log(data); // {}
    });
*/

//var SyncedFile = require("./SyncedFile.js")

// Where our files will be kept
var fileList = []
var gameList = []
/*
electron_data.get('Games')
    .then(value => {
        console.log(value); // {'awesome': 'module'}
        gameName = value;
    });*/

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Update renderer list on app start with currently synced files
    win.webContents.send('update-list', fileList)
    win.webContents.send('update-gameList', gameList)

    // Upon 'addFile' request from renderer: create SyncedFile object, add to file list, and update renderer list
    // TODO: Check for duplicate files (currently broken!)

    ipcMain.handle('saveGame', saveGame)
    function saveGame(event, gameName) {

        setGame(gameName, "path_to_game"); //добавление игры в конфиг

        storage.get('Games', function (error, data) {
            if (error) throw error;
            // data = json2array(data);
            win.webContents.send('update-gameList', data);
        });


    }



    ipcMain.handle('addFile', addFile)
    function addFile(event, filePath) {
        addedFile = new SyncedFile(filePath, fileList.length)
        fileList.push(addedFile)
        //console.log(fileList)

        // Sends objects to be turned into HTML elements
        win.webContents.send('update-list', fileList)
    }

    win.loadFile('index.html')
}


app.whenReady().then(() => {
    // Listens for ipc channel 'addFile' when file is added
    createWindow()
})


// TODO: Catch error when failing to connect to Dropbox
// Start dropbox object with necessary access token while authentication isn't added yet
// const dbx = new Dropbox({
//     accessToken: 'accessToken',
//     fetch
// })

// dbx.filesListFolder({
//     path: '',
// }).then(res => console.log(res.result.entries[0])
// ).catch((e) => console.log(e))