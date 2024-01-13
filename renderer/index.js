'use strict'
var listContainer = document.getElementById('list_container')
const { ipcRenderer } = require('electron')

// delete todo by its text value ( used below in event listener)
const deleteTodo = (e) => {
  ipcRenderer.send('delete-todo', e.target.textContent)
}

// create add todo window button
document.getElementById('createTodoBtn').addEventListener('click', () => {
  ipcRenderer.send('add-todo-window')
})

document.getElementById('addGameBtn').addEventListener('click', () => {
  ipcRenderer.send('add-game-window')
})

/*
document.getElementById('save_game').addEventListener('click', () => {
  console.log('save click');
  ipcRenderer.send('save_game', 'Diablo 2', 'path to game')

})

*/


// вывод списка игр при старте программы
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


// on receive todos
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



