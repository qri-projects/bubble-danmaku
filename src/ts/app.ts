import {app, BrowserWindow, Menu, MenuItem, dialog} from 'electron';
import path from "path";

const url = require("url");

let mainWindow;
import DMclientRE from "./bilive/dm_client_re";
let createWindow = function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable: false,
        maximizable: false,
    })


    // console.log(DMclientRE)
    // const startUrl = path.resolve('./src/index.html');
    // mainWindow.loadURL(startUrl);
    // mainWindow.loadURL('./src/index.html');
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true
    }));

    mainWindow.webContents.openDevTools()
    console.log(DMclientRE)
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})