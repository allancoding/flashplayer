const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain, autoUpdater } = electron;
if (require('electron-squirrel-startup')) app.quit();
require('update-electron-app')();
const Store = require('./settings.js');

const settings = new Store({
	configName: 'user-preferences',
	defaults: {
	  windowBounds: { width: 800, height: 650 },
	  windowRatio: 4/3
	}
  });

let pluginName = null;
let IsDevOpen = false;
let winratio = settings.get('windowRatio');
const isDev = require('electron-is-dev');
if (!isDev) {
	const server = 'https://update.electronjs.org'
	const feed = `${server}/allancoding/flashplayer/${process.platform}-${process.arch}/${app.getVersion()}`
	autoUpdater.setFeedURL(feed)
}
switch (process.platform) {
	case 'win32':
		switch (process.arch) {
			case 'ia32':
			case 'x32':
				pluginName = 'flash/pepflashplayer32.dll';
				break;
			case 'x64':
				pluginName = 'flash/pepflashplayer64.dll';
				break;
		}
		break;
	case 'linux':
		pluginName = 'flash/libpepflashplayer.so';
        app.commandLine.appendSwitch('no-sandbox');
		break;
	case 'darwin':
		pluginName = 'flash/PepperFlashPlayer.plugin';
		break;
}
if (process.platform !== "darwin") {
	app.commandLine.appendSwitch('high-dpi-support', "1");
}

if(process.mainModule.filename.indexOf('app.asar') === -1) {
	pluginName = path.join(__dirname, pluginName);
}else{
	pluginName = path.join(app.getAppPath(), pluginName).replace('app.asar', 'app.asar.unpacked');
}
app.commandLine.appendSwitch('ppapi-flash-path', pluginName);
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.allowRendererProcessReuse = true;
//DEBUG CRAP
//app.commandLine.appendSwitch("--enable-npapi");
//app.commandLine.appendSwitch("--enable-logging");
//app.commandLine.appendSwitch("--log-level", 4);

let mainWindow;
function promptClearCache(win){
	let choice = electron.dialog.showMessageBoxSync({
		type: 'question',
		buttons: ['Yes', 'No'],
		title: 'Flash Player',
		message: 'Are you sure, It will delete all of your progress in games and log you out?'
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

function showHideDev(win){
	if (IsDevOpen) {
		win.webContents.closeDevTools();
		IsDevOpen = false;
	}
	else {
		win.webContents.openDevTools();
		IsDevOpen = true;
	}
}
app.on('ready', function () {
	var menu = Menu.buildFromTemplate([{
		label: 'Flash Player Menu',
		submenu: [{
			label: 'Change Swf File',
			click() {
				win.loadFile('./index.html');
			}
		},{
			label: 'Reload Page',
			click() {
				win.reload();
			}
		},{
			label: 'Go Back',
			click() {
				win.webContents.goBack();
			}
		},{
			label: 'View',
			submenu: [{
				label: 'Full Screen',
				click() {
					if(win.isFullScreen()){
						win.setFullScreen(false);
						win.webContents.send('fullscreen', {full: false,ratio: settings.get('windowRatio')});
					}else{
						win.setFullScreen(true);
						win.webContents.send('fullscreen', {full: true,ratio: settings.get('windowRatio')});
					}
				}
			},{
				label: '1:1',
				click() {
					winratio = 1/1;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
					win.setSize(650,650);
					win.webContents.send('fullscreen', {full: win.isFullScreen(),ratio: settings.get('windowRatio')});
				}
			},{
				label: '3:2',
				click() {
					winratio = 3/2;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
					let { width } = win.getBounds();
					win.setSize(width,650);
					win.webContents.send('fullscreen', {full: win.isFullScreen(),ratio: settings.get('windowRatio')});
				}
			},{
				label: '4:3',
				click() {
					winratio = 4/3;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
					let { width } = win.getBounds();
					win.setSize(width,650);
					win.webContents.send('fullscreen', {full: win.isFullScreen(),ratio: settings.get('windowRatio')});
				}
			},{
				label: '16:9',
				click() {
					winratio = 16/9;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
					let { width } = win.getBounds();
					win.setSize(width,650);
					win.webContents.send('fullscreen', {full: win.isFullScreen(),ratio: settings.get('windowRatio')});
				}
			}]
		},{
			label: 'Advanced',
			submenu: [{
				label: 'Clear Cache',
				click() {
					promptClearCache(win);
				}
			},{
				label: 'Dev Tools',
				click() {
					showHideDev(win);
				}
			}]
		},{
			label: 'Exit',
			click() {
				app.quit()
			}
		}]
	}]);

	Menu.setApplicationMenu(menu);

	let { width, height } = settings.get('windowBounds');
	let win = new BrowserWindow({
		title: "Flash Player",
		width: width,
		height: height,
		minWidth: 200, minHeight: 200,
		show: false,
		transparent: false,
		center: true,
		webPreferences: {
			devTools: true,
			contextIsolation: true,
			plugins: true,
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			nativeWindowOpen: true
		},
		icon: path.join(__dirname, 'icon.ico')
	});
	win.loadFile('index.html');
	setTimeout(() => { win.show() }, 1000);
	win.setAspectRatio(winratio);
	if(winratio == 1/1){
		win.setSize(650,650);
	}
	ipcMain.on('setUrl', (event, url, type) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		if(type == "url"){
			win.loadURL(url);
		}else if(type == "file"){
			win.loadFile(url);
		}else{
			console.log('LOOKS LIKE WE RAN INTO AN ERROR: ');
		}
	})
	ipcMain.on('askfull', (event, url, type) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.webContents.send('fullscreen', {full: win.isFullScreen(),ratio: settings.get('windowRatio')});
	})
	ipcMain.on('setRatio', (event, winratio) => {
		const webContents = event.sender
		const win = BrowserWindow.fromWebContents(webContents)
		win.setAspectRatio(winratio);
		settings.set('windowRatio', winratio);
		let { width } = win.getBounds();
		if(winratio == 1){
			win.setSize(650,650);
		}else{
			win.setSize(width,650);
		}
	})
	win.on('resize', () => {
		if(win.isFullScreen() == false){
		let { width, height } = win.getBounds();
		settings.set('windowBounds', { width, height });
		}
	});
	app.on('browser-window-focus', () => {
	electron.globalShortcut.register('Escape', function(){
		win.setFullScreen(false);
		win.webContents.send('fullscreen', {full: false,ratio: settings.get('windowRatio')});
	});
	electron.globalShortcut.register('CommandOrControl+F', function(){
		if(win.isFullScreen()){
			win.setFullScreen(false);
			win.webContents.send('fullscreen', {full: false,ratio: settings.get('windowRatio')});
		}else{
			win.setFullScreen(true);
			win.webContents.send('fullscreen', {full: true,ratio: settings.get('windowRatio')});
		}
	});
	});
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})
app.on('window-all-closed', () => {
	if( process.platform !== 'darwin' ) {
        app.quit();
    }
});
app.on('will-quit', function(){
  electron.globalShortcut.unregisterAll();
});
app.on('browser-window-blur', () => {
  electron.globalShortcut.unregisterAll()
});
app.on('web-contents-created', (e, webContents) => {
  webContents.on('will-redirect', (e, url) => {
    if (/^file:/.test(url)) e.preventDefault()
  })
});
app.on('web-contents-created', (event, webContents) => {
	webContents.on('select-bluetooth-device', (event, devices, callback) => {
	  // Prevent default behavior
	  event.preventDefault();
	  // Cancel the request
	  callback('');
	});
});
setInterval(() => {
	autoUpdater.checkForUpdates()
}, 10 * 60 * 1000);
