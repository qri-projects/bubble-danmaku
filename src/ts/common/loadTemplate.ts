import {Config} from "../config/config";
import Handlebars from "handlebars";

const fs = require('fs');
import path from "path";

class Templates{
    "danmakuTemplate"
}

async function loadTemplate(config: Config) {
    const danmakuTemplateFilePath = path.resolve(`./config/src/template/${config.danmakuTemplateFileName}`)

    let templates:Templates = new Templates();

    let promise = loadTemplateFromFileName(danmakuTemplateFilePath, (template) => {
        templates.danmakuTemplate = template;
    })

    await promise;
    return templates;
}

function loadTemplateFromFileName(filePath: String, callback: (template) => void) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error("读取配置文件失败")
        } else {
            // console.log(data)
            let template = Handlebars.compile(data);
            callback(template)
        }
    });
}

export default loadTemplate;
export {Templates};
