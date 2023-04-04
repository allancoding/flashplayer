const electron = require('electron');
const path = require('path');
const { app, BrowserWindow, Menu } = electron; 
const prompt = require('electron-prompt');
const Store = require('./settings.js');

const settings = new Store({
	configName: 'user-preferences',
	defaults: {
	  windowBounds: { width: 800, height: 600 }
	}
  });

let pluginName = null;
let IsDevOpen = false;
let iconPath = path.join(__dirname, "./icon.png");

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
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.allowRendererProcessReuse = true;

let mainWindow;

function promptIt(isSplash, win) {
	prompt({
        title: "Flash Player",
		label: "URL/File Path: ",
		inputAttrs: { type: 'text' },
		type: 'input'
	})
	.then((result) => {
		if (result == null) { console.log("The user canceled!") 
            if (!isSplash){app.quit()}} 
            else { 
                console.log('Result: ', result) 
                if (isSplash) { win.loadURL(result) }
				else { 
                    win.loadURL(result);
					setTimeout(() => { win.show() }, 1000);
                }

            }
	}).catch((error) => {console.log('LOOKS LIKE WE RAN INTO AN ERROR: ' + error)})
}

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
		label: 'Menu',
		submenu: [{
			label: 'Change URL',
			click() {
				promptIt(true, win)
			}
		},{
			label: 'Reload Page',
			click() {
				win.reload();
			}
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
		width: width,
		height: height,
		minWidth: 200, minHeight: 200,
		show: false,
		transparent: false,
		center: true,
		icon: iconPath,
		webPreferences: {
			devTools: true,
			contextIsolation: true,
			plugins: true,
			nativeWindowOpen: true
		}
	});
	promptIt(false, win);
	win.on('resize', () => {
		// The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
		// the height, width, and x and y coordinates.
		let { width, height } = win.getBounds();
		// Now that we have them, save them using the `set` method.
		settings.set('windowBounds', { width, height });
	});
})
app.on('window-all-closed', () => {
	app.quit();
});
