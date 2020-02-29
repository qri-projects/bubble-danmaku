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
window.onload = () => {
    danmakuPanel = document.getElementById("danmakuPanel");

    setInterval(() => {
        let childrenCount: number;
        // @ts-ignore
        if ((childrenCount = danmakuPanel.children.length) > 3) {
            for (let i = 0; i < childrenCount - 3; i++) {
                // @ts-ignore
                danmakuPanel.removeChild(danmakuPanel.children[0]);
            }
        }
    }, 1000)
};

electron.ipcRenderer.on('DANMU_MSG', (event, elHtml: String) => {
    console.log(elHtml)
    let danmakuEl = document.createElement("div");

    danmakuPanel.innerHTML += elHtml;
})


electron.ipcRenderer.on("configLoaded", (event, config: Config) => {
    (<MyWindow><unknown>window).config = config;
    addStyle(config);
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


