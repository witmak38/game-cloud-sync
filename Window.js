'use strict'

const { BrowserWindow } = require('electron')
const path = require('path')
// default window settings
const defaultProps = {
  width: 1700,
  height: 600,
  show: false,
  // icon: __dirname + 'icons/app.png',
  icon: path.join(__dirname, 'icons/app.png'),
  // update for electron V5+
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    devTools: true
  }
}

class Window extends BrowserWindow {
  constructor({ file, ...windowSettings }) {
    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)
    // this.webContents.openDevTools()

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

module.exports = Window
