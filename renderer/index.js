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
  //ipcRenderer.send('delete-game', game_id)
  window.electronAPI.delGame(game_id)

}

syncGameBtn.addEventListener('click', () => {
  console.log('sync click');
  //let gameName = '3111111';
  //window.electronAPI.saveGame(gameName);
  //ipcRenderer.send('syncGame')
  window.electronAPI.syncGame()


  window.electronAPI.openNotif(
    "Синхронизация",
    "",
    ""
  )


});

// create add todo window button
/*document.getElementById('createTodoBtn').addEventListener('click', () => {
  ipcRenderer.send('add-todo-window')
})*/

document.getElementById('addGameBtn').addEventListener('click', () => {
  //ipcRenderer.send('add-game-window')
  window.electronAPI.addGameWindow()
})

window.electronAPI.eLog((event, message) => {
  console.log(message)
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


    const dateInMs = game.time
    const date = new Date(dateInMs)
    var date1 = date.toLocaleString()


    html += `<tr class="item__tabl1 list_entry1" data-id="${game.id}">
   
    <td class="td_gamename"><span> ${game.name}</span></td>
      
      <!--<div class="local"><span>31.12.2024</span></div>-->
      <td class="td_syncdate"><span>${date1}</span></td>
      <!--<button class="btn">Up</button>
      <button class="btn">Down</button>-->
      <td class="th_action"><button class="btn del" data-id="${game.id}">Удалить</button></td>
    </tr></tr>`

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
