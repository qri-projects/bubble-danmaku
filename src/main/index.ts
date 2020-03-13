import {app, BrowserWindow} from "electron";
import {Config, loadConfigAsync, saveConfigAsync} from "../common/config/config";
import {loadTemplateText} from "./loadTemplate";
import {fetchGiftInfoAsync, GiftInfo, requestGiftInfoAsync} from "../renderer/scripts/@type/giftInfo";
import store from "../renderer/store/index";

let dev = process.env.NODE_ENV === "development";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (!dev) {
    (<any>global).__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\");
}

let mainWindow: BrowserWindow;
let config: Config;
let configRaw: Config;
let templates;
let configLoaded = false;
let ready = false;
let gifts: Map<number, GiftInfo> = new Map<number, GiftInfo>();
const winURL = dev ? `http://message.bilibili.com` : `file://${__dirname}/index.html`;

async function loadConfigAndTemplates() {
    config = await loadConfigAsync();
    configRaw = {...config}
    templates = await loadTemplateText(config);
}

async function loadGiftsAsync() {
    let giftsList = await requestGiftInfoAsync();
    for (let gift of giftsList) {
        gifts[gift.id] = gift;
    }
}

async function loadConfigAndTemplatesAndGifts() {
    await Promise.all([loadConfigAndTemplates(), loadGiftsAsync()]);
}

loadConfigAndTemplatesAndGifts().then(() => {
    configLoaded = true;
    tryCreateWindow();
});

function tryCreateWindow() {
    if (configLoaded && ready) {
        createWindow();
    }
}

app.on("ready", () => {
    ready = true;
    tryCreateWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: config.height,
        width: dev ? config.width : config.width,
        x: config.x,
        y: config.y,
        transparent: !dev,
        frame: dev,
        useContentSize: true,
        webPreferences: {
            webSecurity: false,
        },
    });

    mainWindow.loadURL(winURL);
    if (dev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("close", ()=>{
        let bounds = mainWindow.getBounds();
        configRaw.x = bounds.x;
        configRaw.y = bounds.y;
        configRaw.width = bounds.width;
        configRaw.height = bounds.height;
        saveConfigAsync(configRaw);
    })

    mainWindow.on("closed", () => {
        // @ts-ignore
        mainWindow = null;
    });
    mainWindow.webContents.on("did-finish-load", function () {
        store.commit("SET_IF_DEV", dev);
        store.commit("SET_CONFIG_PATH", dev ? "../config" : "../../../../config");
        store.commit("SET_GIFTS", gifts);
        store.commit("SET_CONFIG", config);
        store.commit("SET_TEMPLATES", templates);
        mainWindow.webContents.send("configLoaded");
    });
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
