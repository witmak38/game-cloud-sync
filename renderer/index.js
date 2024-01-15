'use strict'
//const { ipcRenderer } = require('electron')
//const { ipcRenderer } = require('electron')
var listContainer = document.getElementById('list_container')
var syncGameBtn = document.getElementById('syncGameBtn')


// delete todo by its text value ( used below in event listener)
/*const deleteTodo = (e) => {
  console.log("deleteTodo")
  ipcRenderer.send('delete-todo', e.target.textContent)


}*/
const deleteGame = (e) => {
  //console.log(e.target);
  let game_id = e.target.getAttribute('data-id');
  // console.log(game_id);
  ipcRenderer.send('delete-game', game_id)

}


syncGameBtn.addEventListener('click', () => {
  console.log('sync click');
  //let gameName = '3111111';
  //window.electronAPI.saveGame(gameName);
  //ipcRenderer.send('syncGame')
  window.electronAPI.syncGame()

  //

});

// create add todo window button
/*document.getElementById('createTodoBtn').addEventListener('click', () => {
  ipcRenderer.send('add-todo-window')
})*/

document.getElementById('addGameBtn').addEventListener('click', () => {
  //ipcRenderer.send('add-game-window')
  window.electronAPI.addGameWindow()
})
/*
document.getElementById('addGameBtn').addEventListener('click', () => {
  ipcRenderer.send('add-game-window')
})
*/
/*
document.getElementById('save_game').addEventListener('click', () => {
  console.log('save click');
  ipcRenderer.send('save_game', 'Diablo 2', 'path to game')

})

*/


// вывод списка игр при старте программы
/*
ipcRenderer.on('update-gameList', (event, gameList) => {

  for (const child of Array.from(listContainer.children)) {
    if (child.className == 'list_entry') {
      child.remove()
    }
  }

  for (const game of gameList) {
    let listEntry = document.createElement('div')
    listEntry.className = 'list_entry'
    // listEntry.id = 
    listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: game['name'] }))
    listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: game['path'] }))
    listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: "31.12.2024" }))
    listEntry.appendChild(Object.assign(document.createElement('p'), { innerHTML: "10.12.2024" }))
    listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Upload to Cloud' }))
    listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Download to Local' }))
    listEntry.appendChild(Object.assign(document.createElement('button'), { innerHTML: 'Delete Game' }))
    listContainer.appendChild(listEntry)
  };


})
*/

// on receive todos
window.electronAPI.updateGameList((event, games) => {
  //ipcRenderer.on('update-gameList', (event, games) => {

  // get the todoList ul
  const gameList = document.getElementById('gameList')

  // create html string
  const gameItems = games.reduce((html, game) => {

    html += `<div class="item__table list_entry" data-id="${game.id}">
   
    <div><span> ${game.name}</span></div>
      
      <div class="local"><span>31.12.2024</span></div>
      <div class="cloud"><span>10.12.2024</span></div>
      <button class="btn">Up</button>
      <button class="btn">Down</button>
      <button class="btn del" data-id="${game.id}">Del</button>
    </div>`

    return html
  }, '')


  // set list html to the todo items
  gameList.innerHTML = gameItems

  // add click handlers to delete the clicked todo
  gameList.querySelectorAll('.list_entry .del').forEach(item => {
    //console.log(item.getElementsByClassName('del'));
    // item = item.getElementsByClassName('del')
    // console.log(item);
    item.addEventListener('click', deleteGame)
  })
  /*gameList.querySelectorAll('.game-item').forEach(item => {
    //console.log(item);
    item.addEventListener('click', deleteGame)
  })*/
})
// on receive todos
/*
ipcRenderer.on('todos', (event, todos) => {
  //console.log(todos);
  // get the todoList ul
  const todoList = document.getElementById('todoList')

  // create html string
  const todoItems = todos.reduce((html, todo) => {
    html += `<li class="todo-item">${todo}</li>`

    return html
  }, '')

  // set list html to the todo items
  todoList.innerHTML = todoItems

  // add click handlers to delete the clicked todo
  todoList.querySelectorAll('.todo-item').forEach(item => {
    item.addEventListener('click', deleteTodo)
  })
})


*/
