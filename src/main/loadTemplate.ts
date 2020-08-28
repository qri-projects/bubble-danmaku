import {Config} from "../common/config/config";

import path from "path";
import {readfileAsync} from "../common/utils/util";
import {configDirPath} from "../common/utils/pathUtil";

class TemplatesText {
    "danmakuTemplate";
    "sendGiftTemplate";
    "superChatTemplate";
    "superChatQueueItemTemplate";
    "innerSuperChatTemplate";
}

async function loadTemplateText(config: Config): Promise<TemplatesText> {
    const templateDirPath = path.join(configDirPath, "src/template");
    const danmakuTemplateFilePath = path.join(templateDirPath, config.danmakuTemplateFileName);
    const sendGiftTemplateFilePath = path.join(templateDirPath, config.sendGiftTemplateFileName);
    const superChatTemplateFilePath = path.join(templateDirPath, config.superChatTemplateFileName);
    const superChatQueueItemTemplateFilePath = path.join(templateDirPath, config.superChatQueueItemTemplateFileName);
    const innerSuperChatTemplateFilePath = path.join(templateDirPath, config.innerSuperChatTemplateFileName);

    let templates = new TemplatesText();
    templates.danmakuTemplate = await readfileAsync(danmakuTemplateFilePath);
    templates.sendGiftTemplate = await readfileAsync(sendGiftTemplateFilePath);
    templates.superChatTemplate = await readfileAsync(superChatTemplateFilePath);
    templates.superChatQueueItemTemplate = await readfileAsync(superChatQueueItemTemplateFilePath);
    templates.innerSuperChatTemplate = await readfileAsync(innerSuperChatTemplateFilePath);
    return templates;
}

export {loadTemplateText, TemplatesText};
