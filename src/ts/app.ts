import {app, BrowserWindow, Menu, MenuItem, dialog} from 'electron';
import path from "path";
import DMclientRE from "./bilive/dm_client_re";
import MyGlobalD from "./@types/MyGlobal"
import Listener from "./common/Listener"
import configWrapper from "./config/config";
const url = require("url");


let mainWindow;

let createWindow = function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        fullscreenable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "view/preload.js"),
        }
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
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.on('did-finish-load', function () {
        (<MyGlobalD><unknown>global).mainWindow = mainWindow;

        configWrapper.loadConfig((config)=>{
            (<MyGlobalD><unknown>global).config = config;
            let listener:Listener = new Listener();
            mainWindow.webContents.send('configLoaded', config)
            listener.listen(config.roomId)
        })

        // console.log('send call')
        // mainWindow.webContents.send('something', '主进程发送到渲染进程的数据')

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
