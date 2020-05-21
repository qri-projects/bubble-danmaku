import path from "path";
import {readfileAsync} from "../utils/util";

const fs = require("fs");

const configFilePath = path.resolve("./config/config.json");

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
    danmakuPanelComponentName: String = "default";
    danmakuTemplateFileName: String = "Danmaku.html";
    sendGiftTemplateFileName: String = "SendGift.html";
    superChatTemplateFileName: String = "SuperChat.html";
    superChatQueueItemTemplateFileName: String = "SuperChatQueueItem.html";
    innerSuperChatTemplateFileName: String = "InnerSuperChat.html";
    superChatPanelComponentName:string = "default";
    extendPanelComponentName:string = "default";
    prefixFileName: Array<string> = ["guard0.png", "guard1.png", "guard2.png", "guard3.png"];
    timerTemplate: String = "year-month-day hour:minute:second";

    userLevelUpperThan = -1;
    medalLevelUpperThan = -1;
    filterRe: Array<string> = [];
    showDrawDanmaku: boolean = true;

    showGift: boolean = true;
    showSilverGift: boolean = true;
    giftCoinUpperThan: { gold: number; silver: number } = { gold: 0, silver: 5000 };

    width = 800;
    height = 600;
    x = 0;
    y = 0;
    top = true;
}

class GuardUserNameColor {
    0: String = "";
    1: "#ff0000";
    2: "#f00000";
    3: "#e00000";
}

class ConfigWrapper {
    config: Config = new Config();

    loadConfig(callback: (config: Config) => void) {
        const configFilePath = path.resolve("./config/config.json");
        fs.readFile(configFilePath, "utf-8", (err, data) => {
            if (err) {
                console.error("读取配置文件失败");
                callback(this.config);
            } else {
                this.config = JSON.parse(data);
                callback(this.config);
            }
        });
    }
}

async function loadConfigAsync(): Promise<Config> {
    let configText: String = await readfileAsync(configFilePath);
    return JSON.parse(<string>configText);
}

async function saveConfigAsync(config) {
    return await fs.writeFileSync("./config/config.json", JSON.stringify(config, null, 4));
}

let configWrapper = new ConfigWrapper();

export default configWrapper;
export { Config, loadConfigAsync, saveConfigAsync, configFilePath };
