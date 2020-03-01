// const electron = require("electron")
import electron from "electron"
import {Config} from "../config/config";
import {MyWindow} from "../@types/MyWindow";
import path from "path";
import Listener, {DanmakuMsgHandler} from "../common/Listener";
import {Templates, TemplatesText} from "../common/loadTemplate"
import DanmakuEl from "./@type/DanmakuEl";
import HandleBars from "handlebars";

electron.ipcRenderer.on('something', (event, message) => {
    console.log('msg:', message) // 主进程发送到渲染进程的数据
    console.log('event:', event) // 主进程发送到渲染进程的数据
})

let config: Config;

let danmakuPanel;
let danmakuPanelBottom;
let popularNumEl;
let timerEl;
let danmakuPanelHover = false;
let danmakuPanelMouseWheelTime = new Date().getTime();

let danmakuElQueue = [];

window.onload = () => {
    danmakuPanel = document.getElementById("danmakuPanel");
    danmakuPanelBottom = document.getElementById("danmakuPanelBottom");
    popularNumEl = document.getElementById("popularNum");
    timerEl = document.getElementById("timer");

    window.onmousewheel = (event) => {
        danmakuPanelMouseWheelTime = new Date().getTime();
    }

    danmakuPanel.onmouseenter = () => {
        danmakuPanelHover = true;
    }

    danmakuPanel.onmouseleave = () => {
        danmakuPanelHover = false;
    }

    let i = 0;
    let checkTimeInterval = 1;
    let lastDate = new Date();
    // 定时任务
    setInterval(() => {
        i += 1;
        if (i % 40 == 0) {

            // 清理旧弹幕
            let childrenCount: number;
            // @ts-ignore
            if ((childrenCount = danmakuPanel.children.length) > config.danmakuCacheLength) {
                for (let i = 0; i < childrenCount - config.danmakuCacheLength; i++) {
                    // @ts-ignore
                    danmakuPanel.removeChild(danmakuPanel.children[0]);
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

    }, 250)
};

function makeTemplates(templatesResInner: TemplatesText) {
    let templates: Templates = new Templates();
    templates.danmakuTemplate = HandleBars.compile(templatesResInner.danmakuTemplate);
    return templates;
}

function makeDanmakuMsgHandler(templates: Templates) {
    let danmakuMsgHandler: DanmakuMsgHandler = {
        handleDanmaku(danmaku: DANMU_MSG): void {
            let danmakuEl = new DanmakuEl(danmaku, config, false);
            let elHtml = templates.danmakuTemplate(danmakuEl)
            let danmakuHtmlEl = document.createElement("div");
            danmakuHtmlEl.setAttribute("class", <string>danmakuEl.outer_div_class);
            danmakuHtmlEl.innerHTML = <string>elHtml;

            danmakuPanel.insertBefore(danmakuHtmlEl, danmakuPanelBottom)
        }, handleGift(sendGift: SEND_GIFT): void {
        }, handleGuard(guardBuy: GUARD_BUY): void {
        }, handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void {
        }

    };
    return danmakuMsgHandler;
}

electron.ipcRenderer.on("configLoaded", (event, configInner: Config, templatesResInner: TemplatesText) => {
    let templates: Templates = makeTemplates(templatesResInner);
    let danmakuMsgHandler = makeDanmakuMsgHandler(templates);

    (<MyWindow><unknown>window).config = configInner;
    config = configInner;
    addStyle(configInner);
    initStyleVariable(config);


    let listener = new Listener(config.roomId, danmakuMsgHandler)
    listener.listen()

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

