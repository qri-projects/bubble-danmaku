import {Templates} from "../loadTemplate";
import DanmakuEl from "../../view/@type/DanmakuEl";
import {Config} from "../../config/config";
import DB, {UserInDB} from "../db";
import {fetchAsync} from "../util";
import {getUser} from "../userUtil";
import {GiftInfo} from "../../view/@type/giftInfo";
import {GiftEl, makeGiftEl} from "../../view/@type/GiftEl";

interface DanmakuMsgHandlerItfc {
    handleDanmaku(danmaku: DANMU_MSG): void;

    handleGift(sendGift: SEND_GIFT): void;

    handleGuard(guardBuy: GUARD_BUY): void;

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void;

    handleOnline(num: number);
}

class DanmakuHandler {
    db: DB;
    config: Config;
    templates: Templates;
    danmakuElQueue: Array<HTMLDivElement>
    popularNumHolder: HTMLDivElement
    giftMap: Map<number, GiftInfo>

    constructor(db: DB, config: Config, templates: Templates, danmakuElQueue: Array<HTMLDivElement>, popularNumHolder: HTMLDivElement, giftMap: Map<number, GiftInfo>) {
        this.db = db;
        this.config = config;
        this.templates = templates;
        this.danmakuElQueue = danmakuElQueue;
        this.popularNumHolder = popularNumHolder;
        this.giftMap = giftMap;
        console.log(this)
    }

    handleDanmaku(danmaku: DANMU_MSG): void {
        console.log(this)
        let that = this;
        let userId = danmaku.info["2"]["0"];
        getUser(userId, that.db).then(user => {
            let danmakuEl = new DanmakuEl(danmaku, that.config, user);
            let elHtml = that.templates.danmakuTemplate(danmakuEl)
            let danmakuHtmlEl = document.createElement("div");
            danmakuHtmlEl.setAttribute("class", <string>danmakuEl.outer_div_class);
            danmakuHtmlEl.innerHTML = <string>elHtml;
            that.danmakuElQueue.push(danmakuHtmlEl);
        });
    }

    async handleGift(sendGift: SEND_GIFT): Promise<void> {
        if (!this.config.showGift) {
            return;
        }
        let userId = sendGift.data.uid;
        let user = await getUser(userId, this.db);
        let giftEl = makeGiftEl(sendGift, this.giftMap, user);
        if (this.config.showSilverGift || (!this.config.showSilverGift && giftEl.coin_type == "gold")) {

        }
    }

    handleGuard(guardBuy: GUARD_BUY): void {
        throw new Error("Method not implemented.");
    }

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void {
        throw new Error("Method not implemented.");
    }

    handleOnline(num: number) {
        throw new Error("Method not implemented.");
    }


}

let fetching: Array<number> = [];

function makeDanmakuHeadImgAndInsert(user: UserInDB, danmakuEl: DanmakuEl, templates: Templates, danmakuElQueue: Array<HTMLDivElement>) {

}

function makeGiftDomElAndInsert(user: UserInDB, giftEl: GiftEl, templates: Templates, danmakuElQueue: Array<HTMLDivElement>) {
    if (user.nickName) {

    }
}

export {DanmakuMsgHandlerItfc, DanmakuHandler};
