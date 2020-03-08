import defaultConfig from "../const/defaultConfig"
import path from "path";
import {readfileAsync} from "../common/util";

const fs = require('fs');


class Config {
    roomId: number = 336119;

    showUserHeadImg: boolean = true;
    showUserName: boolean = true;
    showUserMedal: boolean = true;
    showUserLevel: boolean = true;
    showGuardPrefix: boolean = true;
    showDrawDanmaku: boolean = true;

    showGift: boolean = true;
    showSilverGift: boolean = true;

    userNameRandColors: Array<String> = ["#ffffff"];
    favoriteUserNameColor: String = "gold";
    guardUserNameColor: GuardUserNameColor = new GuardUserNameColor();

    danmakuCacheLength: number = 200;

    styleFileName: String = "default.css";
    danmakuTemplateFileName: String = "Danmaku.html";
    sendGiftTemplateFileName: String = "SendGift.html";
    prefixFileName: Prefix = new Prefix();
    timerTemplate: String = "year-month-day hour:minute:second";
    width = 800;
    height = 600;

    biliAccount = "";
    biliPassword = ""
}

class GuardUserNameColor {
    0: String = "";
    1: "#ff0000";
    2: "#f00000";
    3: "#e00000";
}

class Prefix {
    0: String = "guard0.png";
    1: String = "guard1.png";
    2: String = "guard2.png";
    3: String = "guard2.png";
}

class ConfigWrapper {
    config: Config = new Config();

    loadConfig(callback: (config: Config) => void) {
        const configFilePath = path.resolve('./config/config.json');
        fs.readFile(configFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error("读取配置文件失败")
                callback(this.config)
            } else {
                this.config = JSON.parse(data);
                callback(this.config)
            }
        });
    }

}

async function loadConfigAsync(): Promise<Config> {
    const configFilePath = path.resolve('./config/config.json');
    let configText: String = await readfileAsync(configFilePath)
    let config: Config = <Config>JSON.parse(<string>configText);
    return config;
}

let configWrapper = new ConfigWrapper();

export default configWrapper;
export {Config, loadConfigAsync};
