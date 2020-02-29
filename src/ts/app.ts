import {app, shell, BrowserWindow, Menu, MenuItem, dialog} from 'electron';
import path from "path";
import DMclientRE from "./bilive/dm_client_re";
import MyGlobalD from "./@types/MyGlobal"
import Listener, {DanmakuMsgHandler} from "./common/Listener"
import configWrapper, {Config} from "./config/config";

const url = require("url");
import Handlebars from "handlebars";
import loadTemplate, {Templates} from "./common/loadTemplate";
import DanmakuEl from "./view/@type/DanmakuEl";


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

        configWrapper.loadConfig((config) => {
            (<MyGlobalD><unknown>global).config = config;

            mainWindow.webContents.send('configLoaded', config)

            loadTemplate(config).then((templates: Templates) => {
                let danmakuMsgHandler = makeDanmakuMsgHandler(templates, config);
                let listener: Listener = new Listener(config.roomId, danmakuMsgHandler);
                listener.listen();
            })
            // let listener:Listener = new Listener();
            // listener.listen(config.roomId)
        })

        // console.log('send call')
        // mainWindow.webContents.send('something', '主进程发送到渲染进程的数据')

    })


}

// 不允许创建新窗口，使用默认浏览器打开
app.on('web-contents-created', (e, webContents) => {
    webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});

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

function makeDanmakuMsgHandler(templates: Templates, config: Config) {
    let danmakuMsgHandler: DanmakuMsgHandler = {
        handleDanmaku: (danmaku: DANMU_MSG): void => {
            let danmakuEl = new DanmakuEl(danmaku, config);
            console.log(danmakuEl);
            console.log(123);
            let elHtml = templates.danmakuTemplate(danmakuEl)
            mainWindow.webContents.send('DANMU_MSG', elHtml)
        },
        handleGift(sendGift: SEND_GIFT): void {
            console.log(sendGift)
        },
        handleGuard(guardBuy: GUARD_BUY): void {
            console.log(guardBuy)
        },
        handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void {
            console.log(superChat)
        }
    }
    return danmakuMsgHandler;
}
