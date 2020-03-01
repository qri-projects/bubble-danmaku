import {app, shell, BrowserWindow, Menu, MenuItem, dialog} from "electron";
import path from "path";
import DMclientRE from "./bilive/dm_client_re";
import MyGlobalD from "./@types/MyGlobal";
import Listener, {DanmakuMsgHandler} from "./common/Listener";
import configWrapper, {Config, loadConfigAsync} from "./config/config";

const url = require("url");
import Handlebars from "handlebars";
import {loadTemplateText, Templates} from "./common/loadTemplate";
import DanmakuEl from "./view/@type/DanmakuEl";

let mainWindow;
let config: Config;
let loadedConfig: boolean = false;
let appReady = false, appActivate = false;

loadConfigAsync().then((configInner: Config) => {
    config = configInner;
    console.log(config)
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
        width: 800,
        height: 600,
        fullscreenable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, "view/preload.js"),
        },
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../index.html"),
            protocol: "file:",
            slashes: true,
        })
    );

    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
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
    console.log("ready")
    tryCreateWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    appActivate = true;
    console.log("activate")
    tryCreateWindow();
});
