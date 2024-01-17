'use strict'
//import { ipcRenderer } from 'electron'
const path = require('path')
const rootPath = require('electron-root-path').rootPath;
//const location = path.join(rootPath, 'package.json');
const { app, ipcMain } = require('electron')
const async = require('async');
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

app.setAppUserModelId(process.execPath)

require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

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
  obj.time = "";

  if (db.valid('config-games', location_db)) {
    db.insertTableContent('config-games', location_db, obj, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    })
  }

}
function setGameLastSync(name, time) {

  var where = {
    "name": name
  };

  var set = {
    "time": time
  }

  if (db.valid('config-games', location_db)) {
    db.updateRow('config-games', location_db, where, set, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
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

const desPath = path.resolve('.') + '/SaveGames/'

function syncGame() {
  console.log("syncGame run")
  var gameList = getGames()
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




function main() {








  function checkGameListToUpdate() {

    console.log('checkGameListToUpdate start')



    var gameList = getGames()



    gameList.forEach(item => {

      item.path = item.path.replace(/\\/g, "/")
      var lastUpdateGame = fs.statSync(item.path, { throwIfNoEntry: false });
      var newItemTime = lastUpdateGame['ctime']

      lastUpdateGame = JSON.stringify(lastUpdateGame['ctime'])
      item.time = JSON.stringify(item.time)


      if (item.time != lastUpdateGame) {
        new Notification({
          title: "Синхронизация сохранений",
          body: item.name
        }).show()
        let dPath = path.resolve('.') + '/SaveGames/' + item.name
        copyGameFiles(item.path, dPath)
        setGameLastSync(item.name, newItemTime)

      } else {
      }

      console.log('checkGameListToUpdate end')

    })

  }
  setInterval(checkGameListToUpdate, 10000)




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


  ipcMain.on('notif', (event, title, body) => {
    new Notification({
      title: title,
      body: body
    }).show();

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

  });




}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
