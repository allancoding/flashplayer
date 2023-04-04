const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, Menu } = electron; 
const prompt = require('electron-prompt');

let pluginName = null;
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
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
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
                    win.maximize();
					setTimeout(() => { win.show() }, 1000);
                }

            }
	}).catch((error) => {console.log('LOOKS LIKE WE RAN INTO AN ERROR: ' + error)})
}


app.on('ready', function () {
	var menu = Menu.buildFromTemplate([
		{ label: 'Menu', submenu: [{ label: 'Change URL', click() { promptIt(true, win) }}, { label: 'Exit', click() { app.quit() }}] }
	]);

	Menu.setApplicationMenu(menu);
	
	let win = new BrowserWindow({ show: false, webPreferences: { plugins: true, } });
	promptIt(false, win);
	win.webContents.session.clearCache(function(){});

})
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
