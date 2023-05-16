const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setUrl: (url, type) => ipcRenderer.send('setUrl', url, type),
    fullscreen: (func) => {
        ipcRenderer.on("fullscreen", (event, ...args) => func(...args));
    },
    askfull: () => ipcRenderer.send('askfull'),
    setRatio: (ratio) => ipcRenderer.send('setRatio', ratio)
})
