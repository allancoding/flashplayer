const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const prompt = require('electron-prompt');
const Store = require('./settings.js');

const settings = new Store({
	configName: 'user-preferences',
	defaults: {
	  windowBounds: { width: 800, height: 600 },
	  windowRatio: 4/3
	}
  });

let pluginName = null;
let IsDevOpen = false;
let winratio = settings.get('windowRatio');

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
//app.commandLine.appendSwitch("--enable-npapi");
//app.commandLine.appendSwitch("--enable-logging");
//app.commandLine.appendSwitch("--log-level", 4);
app.allowRendererProcessReuse = true;

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
				win.loadFile('index.html');
			}
		},{
			label: 'Reload Page',
			click() {
				win.reload();
			}
		},{
			label: 'View',
			submenu: [{
				label: 'Full Screen',
				click() {
					win.setFullScreen(true);
					win.webContents.send('fullscreen', true);
				}
			},{
				label: '1:1',
				click() {
					winratio = 1/1;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			},{
				label: '2:3',
				click() {
					winratio = 2/3;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			},{
				label: '3:2',
				click() {
					winratio = 3/2;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			},{
				label: '4:3',
				click() {
					winratio = 4/3;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			},{
				label: '16:9',
				click() {
					winratio = 16/9;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			},{
				label: '9:16',
				click() {
					winratio = 9/16;
					win.setAspectRatio(winratio);
					settings.set('windowRatio', winratio);
				}
			}]
		},{
			label: 'Clear Cache',
			click() {
				promptClearCache(win);
			}
		},{
			label: 'Dev Tool',
			click() {
				showHideDev(win);
			}
		}, {
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
		}
	});
	win.loadFile('index.html');
	setTimeout(() => { win.show() }, 1000);
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
	win.on('resize', () => {
		if(win.isFullScreen() == false){
		let { width, height } = win.getBounds();
		settings.set('windowBounds', { width, height });
		win.setAspectRatio(winratio);
		}
	});
	app.on('browser-window-focus', () => {
	electron.globalShortcut.register('Escape', function(){
		win.setFullScreen(false);
		win.webContents.send('fullscreen', false);
	});
	electron.globalShortcut.register('CommandOrControl+F', function(){
		if(win.isFullScreen()){
			win.setFullScreen(false);
			win.webContents.send('fullscreen', false);
		}else{
			win.setFullScreen(true);
			win.webContents.send('fullscreen', true);
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
})
