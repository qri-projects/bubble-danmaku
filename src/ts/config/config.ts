import defaultConfig from "../const/defaultConfig"
import path from "path";
const fs = require('fs');



class Config {
    roomId: number = 336119;

    showUserHeadImg: boolean = true;
    showUserName: boolean = true;
    showUserMedal: boolean = false;
    showUserMedalSelfOnly: boolean = false;
    showDrawDanmaku:boolean = true;

    userNameRandColors: Array<String> = ["#ffffff"];

    styleFileName: String = "default.css";
    danmakuTemplateFileName:String = "Danmaku.html";
    prefixFileName:Prefix = new Prefix();
}

class Prefix{
    0:String="guard0.png";
    1:String="guard1.png";
    2:String="guard2.png";
    3:String="guard2.png";
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
