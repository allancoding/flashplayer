const electron = require("electron");
const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, Menu, ipcMain, dialog } = electron;
const Store = require("../scritps/settings.js");
const { version } = require("../package.json");
const appPath = app.getAppPath();
const isDev = require("electron-is-dev");
const settings = new Store({
  configName: "user-preferences",
  defaults: {
    windowBounds: { width: 800, height: 650 },
    windowRatio: 4 / 3,
  },
});
setupflash();
app.commandLine.appendSwitch("disable-site-isolation-trials");
app.commandLine.appendSwitch("ignore-certificate-errors", "true");
app.commandLine.appendSwitch("allow-insecure-localhost", "true");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
if (process.platform !== "darwin") {
  app.commandLine.appendSwitch("high-dpi-support", "1");
}
app.allowRendererProcessReuse = true;
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("flashplayer", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("flashplayer");
}
if (!isDev) {
  if (process.platform !== "darwin" || !isAppImage()) {
    const { autoUpdater } = electron;
    let isUpdatePending = false;
    autoUpdater.autoDownload = false;
    if (require("electron-squirrel-startup")) app.quit();
    require("update-electron-app")();
    autoUpdater.setFeedURL({
      url: "https://github.com/allancoding/flashplayer/releases/latest",
    });
    autoUpdater.on("update-available", () => {
      if (!isUpdatePending) {
        const dialogOptions = {
          type: "info",
          title: "Update Available",
          message: `A new version (${version}) of the app is available. Do you want to update now?`,
          buttons: ["Update", "Later"],
        };
        dialog.showMessageBox(dialogOptions).then(({ response }) => {
          if (response === 0) {
            isUpdatePending = true;
            autoUpdater.downloadUpdate();
          } else {
            isUpdatePending = false;
          }
        });
      }
    });
    autoUpdater.on("update-downloaded", () => {
      const dialogOptions = {
        type: "info",
        title: "Update Ready",
        message:
          "An update has been downloaded and is ready to be installed. Click OK to restart the app and install the update.",
        buttons: ["OK"],
      };

      dialog.showMessageBox(dialogOptions).then(() => {
        autoUpdater.quitAndInstall(); // Quit and install the update
      });
    });
  }
} else {
  require("electron-reloader")(module);
}

let IsDevOpen = false;
let winratio = settings.get("windowRatio");
let mainWindow;
let win;
function promptClearCache(win) {
  let choice = electron.dialog.showMessageBoxSync({
    type: "question",
    buttons: ["Yes", "No"],
    title: "Flash Player",
    message:
      "Are you sure, It will delete all of your progress in games and log you out?",
  });
  if (choice != 1) {
    try {
      win.webContents.session.clearCache();
      win.reload();
    } catch (err) {
      return false;
    }
  }
}
function promptHelp(win, text) {
  let choice = electron.dialog.showMessageBoxSync({
    type: "info",
    buttons: ["Ok"],
    title: "Flash Player - Help",
    message: text,
  });
}

function showHideDev(win) {
  if (IsDevOpen) {
    win.webContents.closeDevTools();
    IsDevOpen = false;
  } else {
    win.webContents.openDevTools();
    IsDevOpen = true;
  }
}
app.on("ready", function () {
  var menu = Menu.buildFromTemplate([
    {
      label: "File",
      submenu: [
        {
          label: "Home",
          click() {
            win.loadFile("./index.html");
          },
        },
        {
          label: "Reload",
          click() {
            win.reload();
          },
        },
        {
          label: "Back",
          click() {
            win.webContents.goBack();
          },
        },
        {
          label: "Quit",
          click() {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Advanced",
      submenu: [
        {
          label: "Clear Cache",
          click() {
            promptClearCache(win);
          },
        },
        {
          label: "Dev Tools",
          click() {
            showHideDev(win);
          },
        },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Full Screen",
          click() {
            if (win.isFullScreen()) {
              win.setFullScreen(false);
              win.webContents.send("fullscreen", {
                full: false,
                ratio: settings.get("windowRatio"),
              });
              win.setMenuBarVisibility(true);
            } else {
              win.setFullScreen(true);
              win.webContents.send("fullscreen", {
                full: true,
                ratio: settings.get("windowRatio"),
              });
              win.setMenuBarVisibility(false);
            }
          },
        },
        {
          label: "Resizeable",
          click() {
            win.setAspectRatio(0);
            win.setResizable(true);
            settings.set("windowRatio", 0);
            win.webContents.send("fullscreen", {
              full: win.isFullScreen(),
              ratio: settings.get("windowRatio"),
            });
          },
        },
        {
          label: "Aspect Ratio's",
          submenu: [
            {
              label: "1:1",
              click() {
                winratio = 1 / 1;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                win.setSize(650, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
            {
              label: "3:2",
              click() {
                winratio = 3 / 2;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                let { width } = win.getBounds();
                win.setSize(width, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
            {
              label: "4:3",
              click() {
                winratio = 4 / 3;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                let { width } = win.getBounds();
                win.setSize(width, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
            {
              label: "5:4",
              click() {
                winratio = 5 / 4;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                let { width } = win.getBounds();
                win.setSize(width, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
            {
              label: "16:9",
              click() {
                winratio = 16 / 9;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                let { width } = win.getBounds();
                win.setSize(width, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
            {
              label: "16:10",
              click() {
                winratio = 16 / 10;
                win.setAspectRatio(winratio);
                settings.set("windowRatio", winratio);
                let { width } = win.getBounds();
                win.setSize(width, 650);
                win.webContents.send("fullscreen", {
                  full: win.isFullScreen(),
                  ratio: settings.get("windowRatio"),
                });
              },
            },
          ],
        },
      ],
    },
    {
      label: "Help",
      click() {
        runHelp();
      },
    },
  ]);
  Menu.setApplicationMenu(menu);
  if (process.platform == "darwin") {
    menu.unshift({});
  }
  if (process.platform !== "darwin" || !isAppImage()) {
    if (!isDev) {
      autoUpdater.checkForUpdates();
      if (isUpdatePending) {
        autoUpdater.downloadUpdate();
      }
    }
  }
  ipcMain.on("setUrl", (event, url, type) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (type == "url") {
      win.loadURL(url);
    } else if (type == "file") {
      win.loadFile(url);
    }
  });
  ipcMain.on("askfull", (event, url, type) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.webContents.send("fullscreen", {
      full: win.isFullScreen(),
      ratio: settings.get("windowRatio"),
    });
  });
  ipcMain.on("setRatio", (event, winratio) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setAspectRatio(winratio);
    settings.set("windowRatio", winratio);
    let { width } = win.getBounds();
    if (winratio == 1) {
      win.setSize(650, 650);
    } else {
      win.setSize(width, 650);
    }
  });
  function runHelp() {
    promptHelp(
      win,
      "- Press Command Or Control + Alt + Shift + M to hide the menu.\n- Press Command Or Control + Alt + Shift + F to fullscreen\n- To clear cache data click Menu->Advanced->Clear Cache"
    );
  }
  app.on("browser-window-focus", () => {
    electron.globalShortcut.register("Escape", function () {
      win.setFullScreen(false);
      win.webContents.send("fullscreen", {
        full: false,
        ratio: settings.get("windowRatio"),
      });
    });
    electron.globalShortcut.register(
      "CommandOrControl+Alt+Shift+F",
      function () {
        if (win.isFullScreen()) {
          win.setFullScreen(false);
          win.webContents.send("fullscreen", {
            full: false,
            ratio: settings.get("windowRatio"),
          });
          win.setMenuBarVisibility(true);
        } else {
          win.setFullScreen(true);
          win.webContents.send("fullscreen", {
            full: true,
            ratio: settings.get("windowRatio"),
          });
          win.setMenuBarVisibility(false);
        }
      }
    );
    electron.globalShortcut.register(
      "CommandOrControl+Alt+Shift+M",
      function () {
        if (win.isMenuBarVisible()) {
          win.setMenuBarVisibility(false);
        } else {
          win.setMenuBarVisibility(true);
        }
      }
    );
    electron.globalShortcut.register(
      "CommandOrControl+Alt+Shift+H",
      function () {
        runHelp();
      }
    );
  });
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
if (process.platform !== "darwin" || !isAppImage()) {
  if (!isDev) {
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 30 * 60 * 1000);
  }
}
function createWindow() {
  let { width, height } = settings.get("windowBounds");
  win = new BrowserWindow({
    title: "Flash Player",
    width: width,
    height: height,
    minWidth: 200,
    minHeight: 200,
    show: false,
    transparent: false,
    center: true,
    webPreferences: {
      devTools: true,
      contextIsolation: true,
      plugins: true,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      nativeWindowOpen: true,
    },
    icon: path.join(__dirname, "icon.ico"),
  });
  win.loadFile("index.html");
  setTimeout(() => {
    win.show();
  }, 1000);
  win.setAspectRatio(winratio);
  win.setMenuBarVisibility(true);
  if (winratio == 1 / 1) {
    win.setSize(650, 650);
  }
}
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
    dialog.showErrorBox(
      "Welcome Back",
      `You arrived from: ${commandLine.pop().slice(0, -1)}`
    );
  });
}
app.on("open-url", (event, url) => {
  dialog.showErrorBox("Welcome Back", `You arrived from: ${url}`);
});
app.whenReady().then(() => {
  createWindow();
  win.on("resize", () => {
    if (win.isFullScreen() == false) {
      let { width, height } = win.getBounds();
      settings.set("windowBounds", { width, height });
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
ipcMain.on("shell:open", () => {
  const pageDirectory = __dirname.replace("app.asar", "app.asar.unpacked");
  const pagePath = path.join("file://", pageDirectory, "index.html");
  shell.openExternal(pagePath);
});
app.on("will-quit", function () {
  electron.globalShortcut.unregisterAll();
});
app.on("browser-window-blur", () => {
  electron.globalShortcut.unregisterAll();
});
app.on("web-contents-created", (e, webContents) => {
  webContents.on("will-redirect", (e, url) => {
    if (/^file:/.test(url)) e.preventDefault();
  });
});
app.on("before-quit", () => {
  isUpdatePending = false; // Reset the flag when the app is closed
});
app.on("web-contents-created", (event, webContents) => {
  webContents.on("select-bluetooth-device", (event, devices, callback) => {
    // Prevent default behavior
    event.preventDefault();
    // Cancel the request
    callback("");
  });
});

function setupflash() {
  let pluginName;
  switch (process.platform) {
    case "win32":
      switch (process.arch) {
        case "ia32":
        case "x32":
          pluginName = "flash/pepflashplayer32.dll";
          break;
        case "x64":
          pluginName = "flash/pepflashplayer64.dll";
          break;
      }
      break;
    case "linux":
      pluginName = "flash/libpepflashplayer.so";
      app.commandLine.appendSwitch("no-sandbox");
      break;
    case "darwin":
      pluginName = "flash/PepperFlashPlayer.plugin";
      break;
  }
  if (!appPath.includes("app.asar")) {
    pluginName = path.join(__dirname, pluginName);
  } else {
    pluginName = path
      .join(appPath, pluginName)
      .replace("app.asar", "app.asar.unpacked");
  }
  app.commandLine.appendSwitch("ppapi-flash-path", pluginName);
}

function isAppImage() {
  const exePath = process.execPath;
  const exeDir = path.dirname(exePath);
  const appImagePath = path.join(exeDir, "..", "..", "appimagetool");
  return fs.existsSync(appImagePath);
}
