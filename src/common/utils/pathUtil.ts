import path from "path";
import os from "os";

let dev = process.env.NODE_ENV === "development";

let configDirPath = path.join(__dirname, "../../../config");
let staticDirPath = path.join(__dirname, "../../../static")

if (!dev && os.platform() == "darwin") {
    configDirPath = path.join(__dirname, "../../../../config");
}

let cookiePath = path.join(configDirPath, "cookie.txt");
let configPath = path.join(configDirPath, "config.json");
let windowLocationPath = path.join(configDirPath, "windowLocation.json")


export {configDirPath, configPath, cookiePath, staticDirPath, windowLocationPath}