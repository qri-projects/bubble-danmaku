import defaultConfig from "../const/defaultConfig"
import path from "path";
const fs = require('fs');



class Config {
    roomId: number = defaultConfig.roomId;

    showUserHeadImg: boolean = defaultConfig.showUserHeadImg;
    showUserName: boolean = defaultConfig.showUserName;
    showUserMedal: boolean = defaultConfig.showUserMedal;
    showUserMedalSelfOnly: boolean = defaultConfig.showUserMedalSelfOnly;
    showDrawDanmaku:boolean = defaultConfig.showDrawDanmaku;

    userNameRandColors: Array<String> = defaultConfig.userNameRandColors;

    styleFileName: String = defaultConfig.styleFileName;
}

class ConfigWrapper{
    config:Config = new Config();

    loadConfig(callback:(config:Config)=>void){
        const configFilePath = path.resolve('./config/config.json');
        fs.readFile(configFilePath, 'utf-8', (err, data)=>{
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

let configWrapper = new ConfigWrapper();

export default configWrapper;
export {Config};
