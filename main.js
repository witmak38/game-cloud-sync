'use strict'
//import { ipcRenderer } from 'electron'
const path = require('path')
const rootPath = require('electron-root-path').rootPath;
//const location = path.join(rootPath, 'package.json');
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
const storage = require('electron-json-storage')
const db = require('electron-db')
const fs = require('fs')
const { dialog } = require('electron')
const cron = require('node-cron');
const { Notification } = require('electron')
const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'

require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

//storage.setDataPath(rootPath + '/config');

//const location_db = path.join(__dirname + '/config', '')

const location_db = path.resolve('.') + '/config'




storage.setDataPath(rootPath + '/config');

if (!fs.existsSync(location_db)) {
  fs.mkdirSync(location_db);
}

db.createTable('config-games', location_db, (succ, msg) => {
  // succ - логическое значение, сообщает, успешен ли вызов
  if (succ) {
    console.log(msg)
  } else {
    console.log('Err. ' + msg)
  }
});


function setGame(name, path) {

  let obj = new Object();

  obj.name = name;
  obj.path = path;

  if (db.valid('config-games', location_db)) {
    db.insertTableContent('config-games', location_db, obj, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    })
  }

}

function getGames() {

  let gameList
  db.getAll('config-games', location_db, (succ, data) => {
    // succ - boolean, tells if the call is successful
    // data - array of objects that represents the rows.

    gameList = data
  })
  // console.log(gameList);
  return gameList

}


function copyGameFiles(src, dest) {
  try {
    fs.cpSync(src, dest, {
      recursive: true,
    });
  } catch (error) {
    console.log(error.message);
  }
}


function eLog(message) {
  return message
}


var elog = ''



function syncGame() {
  console.log("syncGame run")
  var gameList = getGames()
  // console.log(gameList[0])

  gameList.forEach(item => {
    item.path = item.path.replace(/\\/g, "/")
    item.path = item.path.replace(/\\/g, "/")
    let destPath = path.resolve('.') + '/SaveGames/' + item.name
    destPath = destPath.replace(/\\/g, "/")
    console.log(destPath)
    elog = destPath
    copyGameFiles(item.path, destPath)
    console.log('syncGame complete')
  })

}

function checkLastMod(path) {
  fs.stat(path, (err, stats) => {
    console.log(stats['ctime'])
  });
}




function main() {

  /*new Notification({
    title: NOTIFICATION_TITLE,
    body: NOTIFICATION_BODY
  }).show()

  cron.schedule('1 * * * * *', () => {
    console.log('start scheduler')
    let time = new Date();
    console.log(time)
    checkLastMod(path)
    console.log('running a task every 1 min');
  });
*/

  //setGame("Diablo 7", "path_to_game"); //добавление игры в конфиг
  //copyGameFiles("C:/Users/User/Documents/My Games/Titan Quest - Immortal Throne", "D:/DEV/MY/Electron/game-cloud-sync-main/SaveGames/Titan Quest - Immortal Throne")

  // todo list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // add todo window
  let addTodoWin


  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once('show', () => {
    mainWindow.webContents.send('update-gameList', getGames())
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.send('todos', todosData.todos)
    // mainWindow.webContents.send('e-log', eLog("test message"))

  })

  //syncGame()
  /*
    ipcMain.on('save_game', (event, nameGame, pathGame) => {
      console.log(nameGame);
      console.log(pathGame);
    })
  */

  // создаем окно для добавления игр
  ipcMain.on('add-game-window', () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('renderer', 'addGame.html'),
        width: 400,
        height: 400,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })

  // create add todo window
  ipcMain.on('add-todo-window', () => {
    // if addTodoWin does not already exist
    if (!addTodoWin) {
      // create a new add todo window
      addTodoWin = new Window({
        file: path.join('renderer', 'add.html'),
        width: 400,
        height: 400,
        // close with the main window
        parent: mainWindow
      })

      // cleanup
      addTodoWin.on('closed', () => {
        addTodoWin = null
      })
    }
  })


  // add-todo from add todo window
  ipcMain.on('add-todo', (event, todo) => {
    const updatedTodos = todosData.addTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })

  ipcMain.on('add-game', (event, game) => {

    setGame(game[0], game[1])

    function myFunc() {
      let updatedGames = getGames()

      mainWindow.send('update-gameList', updatedGames)
    }
    setTimeout(myFunc, 300);

  })

  ipcMain.on('delete-game', (event, game_id) => {
    // const updatedTodos = todosData.deleteTodo(todo).todos
    //console.log(game_id);

    game_id = parseInt(game_id)

    db.deleteRow('config-games', location_db, { 'id': game_id }, (succ, msg) => {
      console.log(msg);
      //console.log(game_id);
    });

    function myFunc() {
      let updatedGames = getGames()
      mainWindow.send('update-gameList', updatedGames)
    }
    setTimeout(myFunc, 300);

  })

  // delete-todo from todo list window
  ipcMain.on('delete-todo', (event, todo) => {

    const updatedTodos = todosData.deleteTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })

  ipcMain.on('syncGame', (event) => {

    // const updatedTodos = todosData.deleteTodo(todo).todos
    syncGame()
    mainWindow.send('eLog', elog)

    // mainWindow.send('todos', updatedTodos)
  })



  ipcMain.on('event-win-close', () => {
    if (addTodoWin) addTodoWin.close();
    console.log('window closed')
  });



  ipcMain.on('hey-open-my-dialog-now', () => {
    //dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
    dialog.showOpenDialog(addTodoWin, {
      properties: ['openFile', 'openDirectory']
    }).then(result => {
      // console.log(result.canceled)
      //console.log(result.filePaths)

      addTodoWin.send('path', result.filePaths)

    }).catch(err => {
      //console.log(err)
    })
    /*
        let options = { properties: ["openDirectory"] }
    
        //Synchronous
        let dir = dialog.showOpenDialog(options)
        console.log(dir)
    
        //Or asynchronous - using callback
        dialog.showOpenDialog(options, (dir) => {
          console.log(dir)
        })
    
    */
  });




}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
