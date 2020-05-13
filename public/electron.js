const { app, BrowserWindow } = require('electron')

const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
  )

  mainWindow.once('closed', () => {
    mainWindow = null
  })
}

app.once('ready', createWindow)

app.once('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.once('uncaughtException', function (err) {
  console.log(err)
})

app.once('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
