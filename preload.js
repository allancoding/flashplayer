const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setUrl: (url, type) => ipcRenderer.send('setUrl', url, type)
})
