import {Config} from "../common/config/config";

import path from "path";
import {readfileAsync} from "../common/utils/util";

class Templates {
    "danmakuTemplate";
    "sendGiftTemplate";
}

class TemplatesText{
    "danmakuTemplate";
    "sendGiftTemplate";
}

async function loadTemplateText(config:Config){
    const danmakuTemplateFilePath = path.resolve(`./config/src/template/${config.danmakuTemplateFileName}`);

    const sendGiftTemplateFilePath = path.resolve(`./config/src/template/${config.sendGiftTemplateFileName}`);
    let templates = new TemplatesText();
    templates.danmakuTemplate = await readfileAsync(danmakuTemplateFilePath);
    templates.sendGiftTemplate = await readfileAsync(sendGiftTemplateFilePath);
    return templates;
}

export {Templates, loadTemplateText, TemplatesText};
