'use strict'

//const { ipcRenderer } = require('electron')


var input_path = ''
var input_name = ''


electronAPI.path((event, path) => {
  input_path = path

  document.querySelector('#path').innerHTML = input_path
  // document.querySelector('#add-input').value = input_name
})


document.querySelector('#add-input').addEventListener('input', function () {
  // console.log(this.value);
  input_name = this.value
  // console.log(input_name)
  // document.querySelector('#add-input').value = '3333'

});



document.querySelector('#add-path').addEventListener('click', () => {

  electronAPI.openDialog()
  // document.querySelector('#add-input').value = '3333'
  //console.log(input_name)
})



document.querySelector('#save_game_conf').addEventListener('click', () => {

  document.getElementById('todoForm').addEventListener('submit', (evt) => {

    evt.preventDefault()

    input_name = evt.target[0].value

    var input = [
      input_name,
      input_path[0]
    ]
    console.log(input)

    if (input_name && input_path[0]) {
      window.electronAPI.addGame(input)
      electronAPI.closeThisWindow()
    }

    // reset input
    input = []



    // document.getElementById("close-btn").addEventListener("click", function (e) {

    // });


  })

})




/*
document.getElementById('todoForm').addEventListener('submit', (evt) => {
  //document.querySelector('#save_game_conf').addEventListener('click', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
  console.log(evt.target)
  // input on the form
  //console.log(evt.target[1].files[0].path);
  //document.getElementById("myFile").files[0].path

  electronAPI.path((event, path) => {
    const input_name = evt.target[0]
    const input_path = path

    console.log(input_path)
    console.log(input_name)
  })







const input = [
  input_name.value,
  input_path
]


// send todo to main process
// ipcRenderer.send('add-game', input)
// window.electronAPI.addGame()

// reset input
input = []
})
*/