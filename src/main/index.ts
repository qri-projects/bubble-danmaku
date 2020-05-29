import { app, BrowserWindow, Tray, Menu, MenuItem, shell, ipcMain, session } from "electron";
import {
    Config,
    loadConfigAsync,
    saveWindowLocationAsync,
    configFilePath,
    WindowLocation, loadWindowLocation
} from "../common/config/config";
import {loadTemplateText, TemplatesText} from "./loadTemplate";
import { fetchGiftInfoAsync, GiftInfo, requestGiftInfoAsync } from "../renderer/scripts/@type/giftInfo";
import store from "../renderer/store/index";
import * as testData from "../common/const/TestData";
import {readfileAsync} from "../common/utils/util";
import path from "path";
import {SendDanmakuUtil} from "./SendDanmakuUtil";

let dev = process.env.NODE_ENV === "development";
// let dev = true;

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
let windowLocation:WindowLocation;
let templates:TemplatesText;
let configLoaded = false;
let ready = false;
let gifts: Map<number, GiftInfo> = new Map<number, GiftInfo>();
let tray;
let cookie: String;
let sendDanmakuUtil: SendDanmakuUtil;
const cookieFilePath = path.resolve("./config/cookie.txt");
const winURL = dev ? `http://message.bilibili.com` : `file://${__dirname}/index.html`;
// const winURL = `file://${__dirname}/index.html`;

async function loadConfigAndTemplates() {
    config = await loadConfigAsync();
    windowLocation = await loadWindowLocation();
    templates = await loadTemplateText(config);
}

async function loadGiftsAsync() {
    let giftsList = await requestGiftInfoAsync();
    for (let gift of giftsList) {
        gifts[gift.id] = gift;
    }
}

async function loadCookieAsync(){
    cookie = await readfileAsync(cookieFilePath);
    cookie = cookie.replace(/\n/g, "")
    cookie = cookie.replace(/\r/g, "")
    cookie = cookie.replace(/ /g, "")
}

async function loadConfigAndTemplatesAndGifts() {
    await Promise.all([loadConfigAndTemplates(), loadGiftsAsync(), loadCookieAsync()]);
}

loadConfigAndTemplatesAndGifts().then(() => {
    configLoaded = true;
    tryCreateWindow();
});

function tryCreateWindow() {
    if (configLoaded && ready) {
        tray = createTray();
        createWindow();
    }
}

app.on("ready", () => {
    ready = true;
    tryCreateWindow();

    ipcMain.on("createSendDanmaku",(e, {roomId, cookie})=>{
        const { net } = require('electron')
        sendDanmakuUtil = new SendDanmakuUtil(net, roomId, cookie);
    })
    ipcMain.on("sendDanmaku", async (e, {msg})=>{
        let res = await sendDanmakuUtil.sendDanmaku(msg);
        res.on("data", (chunk => {
            // console.log(`chunk: ${chunk}`)
        }))
    })
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
        height: windowLocation.height,
        width: dev ? windowLocation.width : windowLocation.width,
        x: windowLocation.x,
        y: windowLocation.y,

        // 透明
        transparent: !dev,
        // 是否有边框
        frame: dev,
        // 任务栏隐藏
        skipTaskbar: !dev,
        // 窗口置顶
        alwaysOnTop: config.top,

        useContentSize: true,
        webPreferences: {
            webSecurity: false,
        },
    });

    mainWindow.loadURL(winURL);
    if (dev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on("close", () => {
        let bounds = mainWindow.getBounds();
        windowLocation.x = bounds.x;
        windowLocation.y = bounds.y;
        windowLocation.width = bounds.width;
        windowLocation.height = bounds.height;
        saveWindowLocationAsync(windowLocation);
    });

    mainWindow.on("closed", () => {
        // @ts-ignore
        mainWindow = null;
    });
    mainWindow.webContents.on("did-finish-load", function() {
        store.commit("SET_IF_DEV", dev);
        store.commit("SET_CONFIG_PATH", dev ? "../config" : "../../../../config");
        store.commit("SET_GIFTS", gifts);
        store.commit("SET_CONFIG", config);
        store.commit("SET_TEMPLATES", templates);
        store.commit("SET_COOKIE", cookie);
        mainWindow.webContents.send("configLoaded");
    });
}

function createTray() {
    let tray = new Tray(dev ? "./static/icon.ico" : "./resources/app.asar/dist/electron/static/icon.ico");
    const menu = new Menu();
    const quitMenuItem = new MenuItem({
        role: "quit",
        label: "退出",
    });

    const separatorMenuItem = new MenuItem({
        type: "separator",
    });
    const configMenuItem = new MenuItem({
        label: "编辑设置文件",
        click: () => {
            shell.openItem(configFilePath);
        },
    });

    if (dev) {
        const testEventMenu = new Menu();
        const testSuperChatMenuItem = new MenuItem({
            label: "superChat",
            click: () => {
                mainWindow.webContents.send("testSuperChat", testData.SUPER_CHAT_DATA);
            },
        });
        const testGuardBuyMenuItem = new MenuItem({
            label: "guardBuy",
            click: () => {
                mainWindow.webContents.send("testGuardBuy", testData.GUARD_BUY_DATA);
            },
        });
        testEventMenu.append(testSuperChatMenuItem);
        testEventMenu.append(testGuardBuyMenuItem);
        const testEventMenuItem = new MenuItem({
            type: "submenu",
            label: "test event",
            submenu: testEventMenu,
        });
        menu.append(testEventMenuItem);
    }

    menu.append(configMenuItem);

    menu.append(separatorMenuItem);
    menu.append(quitMenuItem);

    tray.setToolTip("bubble弹幕使");
    tray.setContextMenu(menu);
    return tray;
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
