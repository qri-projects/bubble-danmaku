import {app, shell, BrowserWindow, Menu, MenuItem, dialog, nativeImage, Tray} from "electron";
import path from "path";
import DMclientRE from "./bilive/dm_client_re";
import MyGlobalD from "./@types/MyGlobal";
import configWrapper, {Config, loadConfigAsync} from "./config/config";

const url = require("url");
import Handlebars from "handlebars";
import {loadTemplateText, Templates} from "./common/loadTemplate";
import DanmakuEl from "./view/@type/DanmakuEl";

let mainWindow: BrowserWindow;
let config: Config;
let loadedConfig: boolean = false;
let appReady = false, appActivate = false;

loadConfigAsync().then((configInner: Config) => {
    config = configInner;
    loadedConfig = true;
    tryCreateWindow()
});

function tryCreateWindow() {
    if (loadedConfig && (appReady || appActivate) && !mainWindow) {
        createWindow();
    }
}

let createWindow = function () {
    mainWindow = new BrowserWindow({
        width: config.width,
        height: config.height,
        fullscreenable: false,
        maximizable: false,

        // 透明
        transparent: true,
        // 无边框
        frame: false,
        // 任务栏隐身
        skipTaskbar: true,
        // 窗口置顶
        alwaysOnTop: true,

        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, "view/preload.js"),
        }
    });

    // mainWindow.setOverlayIcon(nativeImage.createFromPath("../static/icon-512.png"), "一段描述");

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../index.html"),
            protocol: "file:",
            slashes: true,
        })
    );

    // 托盘
    let tray;
    tray = new Tray("./static/icon.ico")
    const menu = new Menu();
    const quitMenuItem = new MenuItem({
        role:"quit",
        label:"退出"
    });
    const separatorMenuItem = new MenuItem({
        type:"separator"
    });
    const configMenuItem = new MenuItem({
        label:"设置",
        click:()=>{}
    })
    menu.append(configMenuItem);
    menu.append(separatorMenuItem);
    menu.append(quitMenuItem);

    tray.setToolTip('This is my application.')
    tray.setContextMenu(menu)

    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
        // @ts-ignore
        mainWindow = null;
    });

    mainWindow.webContents.on("did-finish-load", function () {

        loadTemplateText(config).then((templatesRes) => {
            mainWindow.webContents.send("configLoaded", config, templatesRes);
        });
    });
};

// 不允许创建新窗口，使用默认浏览器打开
app.on("web-contents-created", (e, webContents) => {
    webContents.on("new-window", (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});

app.on("ready", () => {
    appReady = true;

    tryCreateWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    appActivate = true;
    tryCreateWindow();
});
