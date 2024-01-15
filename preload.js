const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
    // called in renderer.js when file is added, file is received in main.js
    sendFileArray: (fileArray) => ipcRenderer.send('sendFiles', fileArray),
    // called in renderer to add file
    addFile: (file) => ipcRenderer.invoke('addFile', file),

    updateList: (fileList) => ipcRenderer.on('update-list', fileList),
    updateGameList: (games) => ipcRenderer.on('update-gameList', games),

    saveGame: (gameName) => ipcRenderer.invoke('saveGame', gameName),

    //new func
    syncGame: () => ipcRenderer.send('syncGame'),
    addGameWindow: () => ipcRenderer.send('add-game-window'),
    addGame: (input) => ipcRenderer.send('add-game', input),
    dialogFolder: () => ipcRenderer.send('dialog-folder'),
    openDialog: (path) => ipcRenderer.send('hey-open-my-dialog-now', path),

    path: (path) => ipcRenderer.on('path', path),

    closeThisWindow: () => ipcRenderer.send('event-win-close')

})