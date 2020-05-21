import {Config} from "../common/config/config";

import path from "path";
import {readfileAsync} from "../common/utils/util";

class TemplatesText {
    "danmakuTemplate";
    "sendGiftTemplate";
    "superChatTemplate";
    "superChatQueueItemTemplate";
}

async function loadTemplateText(config: Config): Promise<TemplatesText> {
    const danmakuTemplateFilePath = path.resolve(`./config/src/template/${config.danmakuTemplateFileName}`);
    const sendGiftTemplateFilePath = path.resolve(`./config/src/template/${config.sendGiftTemplateFileName}`);
    const superChatTemplateFilePath = path.resolve(`./config/src/template/${config.superChatTemplateFileName}`);
    const superChatQueueItemTemplateFilePath = path.resolve(`./config/src/template/${config.superChatQueueItemTemplateFileName}`);
    let templates = new TemplatesText();
    templates.danmakuTemplate = await readfileAsync(danmakuTemplateFilePath);
    templates.sendGiftTemplate = await readfileAsync(sendGiftTemplateFilePath);
    templates.superChatTemplate = await readfileAsync(superChatTemplateFilePath);
    templates.superChatQueueItemTemplate = await readfileAsync(superChatQueueItemTemplateFilePath);
    return templates;
}

export {loadTemplateText, TemplatesText};
