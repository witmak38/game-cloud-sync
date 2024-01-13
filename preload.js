const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // called in renderer.js when file is added, file is received in main.js
  sendFileArray: (fileArray) => ipcRenderer.send('sendFiles', fileArray),
  // called in renderer to add file
  addFile: (file) => ipcRenderer.invoke('addFile', file),

  updateList: (fileList) => ipcRenderer.on('update-list', fileList),
  updategameList: (gameList) => ipcRenderer.on('update-gameList', gameList),

  saveGame: (gameName) => ipcRenderer.invoke('saveGame', gameName),


})