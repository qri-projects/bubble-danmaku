import path from "path";
import { readfileAsync } from "../utils/util";
import {configPath, windowLocationPath} from "../utils/pathUtil";

const fs = require("fs");

class Config {
    roomId: number = 336119;

    showUserHeadImg: boolean = true;
    showUserName: boolean = true;
    showUserMedal: boolean = true;
    showUserLevel: boolean = true;
    showGuardPrefix: boolean = true;

    userNameRandColors: Array<String> = ["#ffffff"];
    favoriteUserNameColor: String = "gold";
    guardUserNameColor: GuardUserNameColor = new GuardUserNameColor();

    danmakuCacheLength: number = 200;

    styleFileName: String = "default.css";
    danmakuTemplateFileName: string = "Danmaku.html";
    sendGiftTemplateFileName: string = "SendGift.html";
    superChatTemplateFileName: string = "SuperChat.html";
    superChatQueueItemTemplateFileName: string = "SuperChatQueueItem.html";
    innerSuperChatTemplateFileName: string = "InnerSuperChat.html";
    danmakuPanelComponentName: String = "default";
    superChatPanelComponentName: string = "default";
    extendPanelComponentName: string = "default";
    sendDanmakuPanelComponentName: string = "default";
    prefixFileName: Array<string> = ["guard0.png", "guard1.png", "guard2.png", "guard3.png"];
    timerTemplate: String = "year-month-day hour:minute:second";

    userLevelUpperThan = -1;
    medalLevelUpperThan = -1;
    filterRe: Array<string> = [];
    showDrawDanmaku: boolean = true;

    showGift: boolean = true;
    showSilverGift: boolean = true;
    giftCoinUpperThan: { gold: number; silver: number } = { gold: 0, silver: 5000 };
    guardBuyGiftImgFileName: Array<string> = ["guard0.png", "guard1.png", "guard2.png", "guard3.png"];
    top = true;
    userExpireTime = 24 * 60 * 60 * 1000;
    enableSendDanmaku = true;
}

class WindowLocation {
    width = 800;
    height = 600;
    x = 0;
    y = 0;
}

class GuardUserNameColor {
    0: String = "";
    1: "#ff0000";
    2: "#f00000";
    3: "#e00000";
}

async function loadConfigAsync(): Promise<Config> {
    let configText: String = await readfileAsync(configPath);
    return <Config>JSON.parse(<string>configText);
}

async function loadWindowLocation(): Promise<WindowLocation> {
    let text: String = await readfileAsync(windowLocationPath);
    return <WindowLocation>JSON.parse(<string>text);
}

async function saveWindowLocationAsync(windowLocation) {
    return await fs.writeFileSync(windowLocationPath, JSON.stringify(windowLocation, null, 4));
}

export { Config, WindowLocation, loadConfigAsync, loadWindowLocation, saveWindowLocationAsync, configPath };
