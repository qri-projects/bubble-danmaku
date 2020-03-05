import {Config} from "../config/config";
import Handlebars from "handlebars";

import path from "path";
import {readfileAsync} from "./util";

class Templates {
    "danmakuTemplate"
}

class TemplatesText{
    "danmakuTemplate"
}

async function loadTemplateText(config:Config){
    const danmakuTemplateFilePath = path.resolve(`./config/src/template/${config.danmakuTemplateFileName}`);
    let templates = new TemplatesText();
    templates.danmakuTemplate = await readfileAsync(danmakuTemplateFilePath);
    return templates;
}

export {Templates, loadTemplateText, TemplatesText};
