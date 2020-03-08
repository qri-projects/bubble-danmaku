// const electron = require("electron")
import electron from "electron"
import {Config} from "../config/config";
import {MyWindow} from "../@types/MyWindow";
import path from "path";
import {Templates, TemplatesText} from "../common/loadTemplate"
import DanmakuEl from "./@type/DanmakuEl";
import HandleBars from "handlebars";
import DB, {UserInDB} from "../common/db";
import {DanmakuHandler} from "../common/danmakuHandler/danmakuHandler";
import Listener from "../common/Listener";
import {fetchGiftInfoAsync} from "./@type/giftInfo";
import {GiftInfo} from "./@type/giftInfo";
import {GiftEl} from "./@type/GiftEl";

electron.ipcRenderer.on('something', (event, message) => {
    console.log('msg:', message) // 主进程发送到渲染进程的数据
    console.log('event:', event) // 主进程发送到渲染进程的数据
})

let config: Config;

let danmakuPanel;
let danmakuPanelBottom;
let popularNumEl;
let timerEl;
let popularNumHolderEl;

let danmakuPanelHover = false;
let danmakuPanelMouseWheelTime = new Date().getTime();

let danmakuElQueue: Array<HTMLDivElement> = [];
let giftMap:Map<number, GiftInfo> = new Map<number, GiftInfo>();
let db: DB;

window.onload = () => {
    initDomEl();

    window.onmousewheel = () => {
        danmakuPanelMouseWheelTime = new Date().getTime();
    }

    danmakuPanel.onmouseenter = () => {
        danmakuPanelHover = true;
    }

    danmakuPanel.onmouseleave = () => {
        danmakuPanelHover = false;
    }

    let i = 0;
    let checkTimeInterval = 50;
    let lastDate = new Date();
    let insertDanmakuInterval = 50;
    let perIntervalInsertDanmakuNum = 1;
    // 定时任务
    setInterval(() => {
        i += 1;

        if (i % 400 == 0) {
            if (config.danmakuCacheLength > 0) {
                // 清理旧弹幕
                let childrenCount: number;
                if ((childrenCount = danmakuPanel.children.length) > config.danmakuCacheLength) {
                    for (let i = 0; i < childrenCount - config.danmakuCacheLength; i++) {
                        danmakuPanel.removeChild(danmakuPanel.children[0]);
                    }
                }
            }
        }

        if (i % checkTimeInterval == 0) {
            let current = new Date();
            if (current.getSeconds() !== lastDate.getSeconds()) {
                let tmp;
                let timeStr = config.timerTemplate
                    .replace("year", current.getFullYear().toString())
                    .replace("month", ((tmp = (current.getMonth() + 1)) < 10 ? "0" + tmp : tmp.toString()))
                    .replace("day", (tmp = current.getDate()) < 10 ? "0" + tmp : tmp.toString())
                    .replace("hour", (tmp = current.getHours()) < 10 ? "0" + tmp : tmp.toString())
                    .replace("minute", (tmp = current.getMinutes()) < 10 ? "0" + tmp : tmp.toString())
                    .replace("second", (tmp = current.getSeconds()) < 10 ? "0" + tmp : tmp.toString())

                timerEl.innerText = timeStr;
            }
            lastDate = current;
        }

        // 每秒一次, 调整发弹幕速度
        if (i % 50 == 0) {
            let speed = danmakuElQueue.length / 3;
            perIntervalInsertDanmakuNum = Math.ceil(speed / 50);

            insertDanmakuInterval = Math.floor((1000 / (speed / perIntervalInsertDanmakuNum)) / 20);
        }

        //
        if (i % insertDanmakuInterval == 0) {
            for (let j = 0; j < perIntervalInsertDanmakuNum; j++) {
                consumeDanmaku();
            }
        }

    }, 20)
};

function initDomEl() {
    danmakuPanel = document.getElementById("danmakuPanel");
    danmakuPanelBottom = document.getElementById("danmakuPanelBottom");
    popularNumEl = document.getElementById("popularNum");
    timerEl = document.getElementById("timer");
    popularNumHolderEl = document.getElementById("popularNum");
}

function makeTemplates(templatesResInner: TemplatesText) {
    let templates: Templates = new Templates();
    templates.danmakuTemplate = HandleBars.compile(templatesResInner.danmakuTemplate);
    templates.sendGiftTemplate = HandleBars.compile(templatesResInner.sendGiftTemplate);
    return templates;
}

function consumeDanmaku() {
    let danmakuHtmlEl;
    if ((danmakuHtmlEl = danmakuElQueue.shift()) != null) {
        danmakuPanel.insertBefore(danmakuHtmlEl, danmakuPanelBottom)
    }
}


electron.ipcRenderer.on("configLoaded", (event, configInner: Config, templatesResInner: TemplatesText) => {
    db = new DB();

    db.connectAsync().then(() => {
        fetchGiftInfoAsync().then((giftInfoInner)=>{
            let gifts:Array<GiftInfo> = giftInfoInner.data.list;
            for(let gift of gifts){
                giftMap[gift.id] = gift;
            }

            config = configInner;
            let templates: Templates = makeTemplates(templatesResInner);
            (<MyWindow><unknown>window).config = configInner;
            let danmakuHandler = new DanmakuHandler(db,config, templates, danmakuElQueue, popularNumHolderEl, giftMap);
            addStyle(configInner);
            initStyleVariable(config);

            let listener = new Listener(config.roomId, danmakuHandler)
            listener.listen()
        });

    })
});


function addStyle(config: Config) {
    const styleFilePath = path.resolve(`./config/src/style/${config.styleFileName}`);
    let s = document.createElement("link");
    s.rel = "stylesheet";
    s.type = "text/css";
    s.href = `file:///${styleFilePath}`;
    s.disabled = false;
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(s);
}

function initStyleVariable(config: Config) {
    if (!config.showUserName) {
        document.documentElement.style.setProperty("--show-user-name", "none");
    }
    if (!config.showUserMedal) {
        document.documentElement.style.setProperty("--show-user-medal", "none");
    }
    if (!config.showUserLevel) {
        document.documentElement.style.setProperty("--show-user-level", "none");
    }
    if (!config.showGuardPrefix) {
        document.documentElement.style.setProperty("--show-guard-prefix", "none");
        document.documentElement.style.setProperty("--guard-prefix-width", "0");
    }
    if (!config.showUserHeadImg) {
        document.documentElement.style.setProperty("--show-user-head-img", "none");
        document.documentElement.style.setProperty("--user-head-img-width", "0");
    }
}

