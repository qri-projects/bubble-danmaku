// const electron = require("electron")
import electron from "electron"
import {Config} from "../config/config";
import {MyWindow} from "../@types/MyWindow";
import path from "path";
import Listener, {DanmakuMsgHandler} from "../common/Listener";
import loadTemplate, {Templates} from "../common/loadTemplate"
import DanmakuEl from "./@type/DanmakuEl";

electron.ipcRenderer.on('something', (event, message) => {
    console.log('msg:', message) // 主进程发送到渲染进程的数据
    console.log('event:', event) // 主进程发送到渲染进程的数据
})

let config: Config;

// electron.ipcRenderer.on('DANMU_MSG', (event, message: DANMU_MSG) => {
//     console.log(message)
//     let content = message.info[1]
//     let user = message.info[2]
//     let userMedal = message.info[3]
//
//     /**
//      * 舰队类型,0为非舰队, 1总督, 2提督, 3舰长
//      */
//     let privilegeType = message.info[7]
// })
let danmakuPanel;
let popularNumEl;
let timerEl;
window.onload = () => {
    danmakuPanel = document.getElementById("danmakuPanel");
    popularNumEl = document.getElementById("popularNum");
    timerEl = document.getElementById("timer");
    let i = 0;
    let checkTimeInterval = 1;
    let lastDate = new Date();
    // 定时任务
    setInterval(() => {
        i += 1;
        if (i % 4 == 0) {

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

electron.ipcRenderer.on('DANMU_MSG', (event, elHtml: String) => {
    console.log(elHtml)
    danmakuPanel.innerHTML += elHtml;
    danmakuPanel.scrollTop = danmakuPanel.scrollHeight;
})


electron.ipcRenderer.on("configLoaded", (event, configInner: Config) => {
    (<MyWindow><unknown>window).config = configInner;
    config = configInner;
    addStyle(configInner);
    initStyleVariable(config);
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

function initStyleVariable(config:Config) {
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

