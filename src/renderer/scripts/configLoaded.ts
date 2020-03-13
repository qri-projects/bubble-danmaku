import electron from "electron";
import {Config} from "../../common/config/config";
import {Templates} from "../../main/loadTemplate";
import DB from "./db";
import {fetchGiftInfoAsync, GiftInfo} from "./@type/giftInfo";

const path = require("path");
import store from "../store/index";
import Vue from "vue";

async function handleConfigLoaded() {
    let db = new DB();
    await db.connectAsync();
    let config = store.state.config;
    addStyle(config);
    initStyleVariable(config);
    window.db = db;

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

function addStyle(config: Config) {
    let s = document.createElement("link");
    s.rel = "stylesheet";
    s.type = "text/css";
    // s.href = `file:///${styleFilePath}`;
    s.href = `${store.state.configPath}/src/style/${config.styleFileName}`
    s.disabled = false;
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(s);
}

export {handleConfigLoaded};
