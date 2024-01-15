'use strict'

const { ipcRenderer } = require('electron')

document.getElementById('todoForm').addEventListener('submit', (evt) => {
  // prevent default refresh functionality of forms
  evt.preventDefault()
  // input on the form
  //console.log(evt.target[1].files[0].path);
  //document.getElementById("myFile").files[0].path
  const input_name = evt.target[0]
  const input_path = evt.target[1]

  const input = [
    input_name.value,
    input_path.files[0].path
  ]


  // send todo to main process
  ipcRenderer.send('add-game', input)

  // reset input
  input = []
})
