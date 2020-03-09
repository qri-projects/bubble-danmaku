import DB, {UserInDB} from "./db";
import {Config} from "../../common/config/config";
import {Templates} from "../../main/loadTemplate";
import {GiftInfo} from "./@type/giftInfo";
import DanmakuEl from "./@type/DanmakuEl";
import store from "../store";
import {getDefaultUser, getUserInfo} from "./util/getUserInfoUtil";

interface DanmakuMsgHandlerItfc {
    handleDanmaku(danmaku: DANMU_MSG): void;

    handleGift(sendGift: SEND_GIFT): void;

    handleGuard(guardBuy: GUARD_BUY): void;

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void;

    handleOnline(num: number);
}

let that: DanmakuHandler;

class DanmakuWrapper {
    danmaku: DANMU_MSG;
    user: UserInDB;

    constructor(danmaku: DANMU_MSG, user: UserInDB) {
        this.danmaku = danmaku;
        this.user = user;
    }
}

class SendGiftWrapper {
    sendGift: SEND_GIFT;
    user: UserInDB;

    constructor(sendGift: SEND_GIFT, user: UserInDB) {
        this.sendGift = sendGift;
        this.user = user;
    }
}

class GuardBuyWrapper {
    guardBug: GUARD_BUY;
    user: UserInDB;

    constructor(guardBug: GUARD_BUY, user: UserInDB) {
        this.guardBug = guardBug;
        this.user = user;
    }
}

class DanmakuHandler {
    db: DB;
    config: Config;
    danmakuQueue: Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>;
    gifts: Map<number, GiftInfo>;

    constructor(danmakuQueue: Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>) {
        this.db = window.db;
        this.config = store.state.config;
        this.danmakuQueue = danmakuQueue;
        this.gifts = store.state.gifts;
        that = this;
    }

    async handleDanmaku(danmaku: DANMU_MSG): Promise<void> {
        console.log(danmaku)
        let user = await getUserInfo(danmaku.info["2"]["0"]);
        if (!user) {
            user = getDefaultUser(danmaku.info["2"]["0"], danmaku.info["2"]["1"]);
        }
        this.danmakuQueue.push(new DanmakuWrapper(danmaku, user));
    }

    async handleGift(sendGift: SEND_GIFT): Promise<void> {
        let user = await getUserInfo(sendGift.data.uid);
        if (!user) {
            user = getDefaultUser(sendGift.data.uid, sendGift.data.uname);
            user.faceUrl = sendGift.data.face;
        }
        let comboId = sendGift.data.batch_combo_id;
        if (comboId) {
            if (!store.state.comboMap.has(comboId)) {
                this.danmakuQueue.push(new SendGiftWrapper(sendGift, user));
            }
            if (sendGift.data.super_gift_num) {
                store.state.comboMap[comboId] = sendGift.data.super_gift_num
            } else {
                store.state.comboMap[comboId] = sendGift.data.num;
            }
        }
    }

    async handleGuard(guardBuy: GUARD_BUY): Promise<void> {
        let user = await getUserInfo(guardBuy.data.uid);
        if(!user){
            user = getDefaultUser(guardBuy.data.uid, guardBuy.data.username);
        }
        this.danmakuQueue.push(new GuardBuyWrapper(guardBuy, user));
    }

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void {
        throw new Error("Method not implemented.");
    }

    handleOnline(num: number) {
        store.commit("SET_POPULAR_NUM", num)
    }
}

let fetching: Array<number> = [];

export {DanmakuMsgHandlerItfc, DanmakuHandler, DanmakuWrapper, SendGiftWrapper, GuardBuyWrapper};
