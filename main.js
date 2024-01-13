'use strict'

const path = require('path')
const rootPath = require('electron-root-path').rootPath;
//const location = path.join(rootPath, 'package.json');
const { app, ipcMain } = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
const storage = require('electron-json-storage');
const db = require('electron-db');
require('electron-reload')(__dirname)

// create a new todo store name "Todos Main"
const todosData = new DataStore({ name: 'Todos Main' })

//storage.setDataPath(rootPath + '/config');

const location_db = path.join(__dirname + '/config', '')
storage.setDataPath(rootPath + '/config');
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


let gameList
db.getAll('config-games', location_db, (succ, data) => {
  // succ - boolean, tells if the call is successful
  // data - array of objects that represents the rows.

  gameList = data
})
console.log(gameList);

function main() {
  //setGame("Diablo 7", "path_to_game"); //добавление игры в конфиг
  // todo list window
  let mainWindow = new Window({
    file: path.join('renderer', 'index.html')
  })

  // add todo window
  let addTodoWin


  // TODO: put these events into their own file

  // initialize with todos
  mainWindow.once('show', () => {
    mainWindow.webContents.send('update-gameList', gameList)
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.send('todos', todosData.todos)
  })
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

  // delete-todo from todo list window
  ipcMain.on('delete-todo', (event, todo) => {
    const updatedTodos = todosData.deleteTodo(todo).todos

    mainWindow.send('todos', updatedTodos)
  })
}

app.on('ready', main)

app.on('window-all-closed', function () {
  app.quit()
})
