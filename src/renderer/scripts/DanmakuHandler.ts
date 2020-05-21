import DB, { UserInDB } from "./db";
import { Config } from "../../common/config/config";
import { GiftInfo } from "./@type/giftInfo";
import store from "../store";
import { getDefaultUser, getUserInfo } from "./util/getUserInfoUtil";

interface DanmakuMsgHandlerItfc {
    handleDanmaku(danmaku: DANMU_MSG): void;

    handleGift(sendGift: SEND_GIFT): void;

    handleGuard(guardBuy: GUARD_BUY): void;

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void;

    handleOnline(num: number);
}

class DanmakuWrapper {
    danmaku: DANMU_MSG;
    user: UserInDB;
    key: string;
    comboId = "-1";

    constructor(danmaku: DANMU_MSG, user: UserInDB) {
        this.danmaku = danmaku;
        this.user = user;
        this.key = `danmaku-${danmaku.info["0"]["4"]}-${danmaku.info["0"]["5"]}`;
    }
}

class SendGiftWrapper {
    sendGift: SEND_GIFT;
    user: UserInDB;
    key: string;
    comboId: string;

    constructor(sendGift: SEND_GIFT, user: UserInDB, comboId: string) {
        this.sendGift = sendGift;
        this.user = user;
        this.key = `sendGift-${sendGift.data.timestamp}-${sendGift.data.rnd}-${Math.random()}`;
        this.comboId = comboId;
    }
}

class GuardBuyWrapper {
    guardBuy: GUARD_BUY;
    user: UserInDB;
    key: string;
    comboId = "-1";

    constructor(guardBuy: GUARD_BUY, user: UserInDB) {
        this.guardBuy = guardBuy;
        this.user = user;
        this.key = `guardBuy-${guardBuy.data.uid}-${guardBuy.data.end_time}`;
    }
}

class SuperChatWrapper {
    superChat: SUPER_CHAT_MESSAGE;
    user: UserInDB;
    remainTime: number;
    key: string;

    constructor(superChat: SUPER_CHAT_MESSAGE, user: UserInDB) {
        this.superChat = superChat;
        this.user = user;
        this.key = `superchat-${superChat.data.uid}-${superChat.data.start_time}-${Math.random()}`;
        this.remainTime = superChat.data.time;
    }
}

class DanmakuHandler {
    handleDanmaku = (danmaku: DANMU_MSG) => {
        console.log("default handleDanmaku");
        console.log(danmaku);
    };
    handleGift = (sendGift: SEND_GIFT) => {
        console.log("default handleGift");
        console.log(sendGift);
    };
    handleGuard = (guardBuy: GUARD_BUY) => {
        console.log("default handleGuard");
        console.log(guardBuy);
    };
    handleSuperChat = (superChat: SUPER_CHAT_MESSAGE) => {
        console.log("default handleSuperChat");
        console.log(superChat);
    };
    handleOnline = (num: number) => {
        console.log("default handleOnline");
        console.log(num);
    };
}

let fetching: Array<number> = [];

export { DanmakuMsgHandlerItfc, DanmakuHandler, DanmakuWrapper, SendGiftWrapper, GuardBuyWrapper, SuperChatWrapper };
