'use strict'

const { app, BrowserWindow, BaseWindow, ipcMain, Menu, Tray } = require('electron')
app.setName("321");
const path = require('path')
// default window settings
const defaultProps = {
  width: 900,
  minWidth: 900,
  maxWidth: 900,
  height: 400,
  minHeight: 400,
  maxHeight: 700,
  show: false,
  autoHideMenuBar: true,
  // icon: __dirname + 'icons/app.png',
  icon: path.join(__dirname, 'icons/app.png'),
  // update for electron V5+
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: true,
    devTools: false
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

function contextMenus() {
  /*let tray = null;



  Window.on('close', function (event) {
    if (!app.isQuiting) {
      event.preventDefault();
      Window.hide();
    }

    if (tray) { return Window.hide(); }

    //  tray documentation at - https://github.com/electron/electron/blob/main/docs/api/menu-item.md
    tray = new Tray('icons/app.png');
    const template = [
      {
        label: 'GameSync',
        // icon: 'icons/app.png',
        enabled: true,
      },
      {
        type: 'separator',
      },
      {
        label: 'Показать', click: function () {
          //mainWindow.show();

          Window.show()

        },
      },
      {
        label: 'Скрыть', click: function () {
          Window.close();
        },
      },
      {
        label: 'Выход', click: function () {

          //mainWindow.close();
          console.log(Window.getAllWindows());
          //BrowserWindow.getAllWindows().forEach((w) => w.destroy());
          //app.quit();

        },
      },
    ];
    const contextMenu = Menu.buildFromTemplate(template);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('GameSync');
    Window.hide();

    return false;
  });*/

  let tray = null


  app.whenReady().then(() => {
    const iconPath = path.join(__dirname, 'icons/app1.png');
    tray = new Tray(iconPath);
    //tray = new Tray('icons/app1.png')
    const contextMenu = Menu.buildFromTemplate([
      { label: 'GameSync', icon: iconPath, enabled: false },
      { type: 'separator' },
      /*{
        label: 'Синхронизировать', click: function () {
          //Window.close();
          Window = BaseWindow.getAllWindows().forEach((w) => w.hide());

          // console.log(BaseWindow.getAllWindows());
        },
      },*/
      {
        label: 'Показать/Скрыть',
        click: function () {
          //mainWindow.show();
          //BaseWindow.show()
          Window = BaseWindow.getAllWindows().forEach((w) => {
            //w.show()
            if (w.isVisible()) {
              w.hide()
            } else {
              w.show()
            }
          });

        },
      },
      /*{
        label: 'Скрыть', click: function () {
          //Window.close();
          Window = BaseWindow.getAllWindows().forEach((w) => w.hide());

          // console.log(BaseWindow.getAllWindows());
        },
      },*/
      /*{ label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' },*/
      {
        label: 'Выход',
        //icon: 'icons/app.png',
        accelerator: 'CmdOrCtrl+Q',
        enabled: true,
        click: function () {

          //mainWindow.close();
          //console.log(BaseWindow.getAllWindows());
          BaseWindow.getAllWindows().forEach((w) => w.destroy());
          //BrowserWindow.getAllWindows().forEach((w) => w.destroy());
          //app.quit();

        },
      }
    ])
    tray.setToolTip('GameSync')
    tray.setContextMenu(contextMenu)
    tray.on('double-click', function (e) {
      Window = BaseWindow.getAllWindows().forEach((w) => {
        //w.show()
        if (w.isVisible()) {
          w.hide()
        } else {
          w.show()
        }
      });
    });
  })

}


contextMenus();
