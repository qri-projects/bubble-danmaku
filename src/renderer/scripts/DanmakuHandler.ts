import DB, {UserInDB} from "./db";
import {Config} from "../../common/config/config";
import {Templates} from "../../main/loadTemplate";
import {GiftInfo} from "./@type/giftInfo";
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
    key: string;
    comboId = "-1"

    constructor(danmaku: DANMU_MSG, user: UserInDB) {
        this.danmaku = danmaku;
        this.user = user;
        this.key = `danmaku-${danmaku.info['0']['4']}-${danmaku.info['0']['5']}`
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
        this.key = `sendGift-${sendGift.data.timestamp}-${sendGift.data.rnd}-${Math.random()}`
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
        this.key = `guardBuy-${guardBuy.data.uid}-${guardBuy.data.end_time}`

    }
}

class SuperChatWrapper {
    superChat: SUPER_CHAT_MESSAGE;
    user: UserInDB;
    key: string;

    constructor(superChat: SUPER_CHAT_MESSAGE, user: UserInDB) {
        this.superChat = superChat;
        this.user = user;
        this.key = `superchat-${superChat.data.uid}-${superChat.data.time}`;
    }
}

class DanmakuHandler{
    handleDanmaku = (danmaku: DANMU_MSG)=>{
        console.log("default handleDanmaku")
        console.log(danmaku)}
    handleGift = (sendGift: SEND_GIFT)=>{}
    handleGuard = (guardBuy: GUARD_BUY)=>{}
    handleSuperChat = (superChat: SUPER_CHAT_MESSAGE)=>{}
    handleOnline = (num: number) => {}
}

class DanmakuHandler0 {
    db: DB;
    config: Config;
    danmakuQueue: Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>;
    gifts: Map<number, GiftInfo>;
    comboMap: Map<string, number>;

    constructor(danmakuQueue: Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>, superChatQueue: Array<SuperChatWrapper>, comboMap: Map<string, number>) {
        this.db = window.db;
        this.config = store.state.config;
        this.danmakuQueue = danmakuQueue;
        this.gifts = store.state.gifts;
        this.comboMap = comboMap;
        that = this;
    }

    async handleDanmaku(danmaku: DANMU_MSG): Promise<void> {
        let user = await getUserInfo(danmaku.info["2"]["0"], danmaku.info["2"]["1"], "");
        if (!user) {
            user = getDefaultUser(danmaku.info["2"]["0"], danmaku.info["2"]["1"]);
        }
        console.log(danmaku)
        this.danmakuQueue.push(new DanmakuWrapper(danmaku, user));
    }

    async handleGift(sendGift: SEND_GIFT): Promise<void> {
        let user = await getUserInfo(sendGift.data.uid, sendGift.data.uname, sendGift.data.face);
        if (!user) {
            user = getDefaultUser(sendGift.data.uid, sendGift.data.uname, sendGift.data.face);
        }
        console.log(sendGift)
        let comboId = sendGift.data.batch_combo_id;
        if (comboId) {
            if (!this.comboMap.has(comboId)) {
                this.danmakuQueue.push(new SendGiftWrapper(sendGift, user, comboId));
            }
            if (sendGift.data.super_gift_num) {
                this.comboMap.set(comboId, sendGift.data.super_gift_num)
            } else {
                this.comboMap.set(comboId, sendGift.data.num)
            }
            console.log(this.comboMap)
        } else {
            this.danmakuQueue.push(new SendGiftWrapper(sendGift, user, "-1"));
        }
    }

    async handleGuard(guardBuy: GUARD_BUY): Promise<void> {
        console.log(guardBuy)
        // let user = await getUserInfo(guardBuy.data.uid);
        // if (!user) {
        //     user = getDefaultUser(guardBuy.data.uid, guardBuy.data.username);
        // }
        // this.danmakuQueue.push(new GuardBuyWrapper(guardBuy, user));
    }

    async handleSuperChat(superChat: SUPER_CHAT_MESSAGE) {
        console.log(superChat);
        let user = await getUserInfo(superChat.data.uid, superChat.data.user_info.uname, superChat.data.user_info.face);
        if(!user){
            user = getDefaultUser(superChat.data.uid, superChat.data.user_info.uname, superChat.data.user_info.face)
        }
        new SuperChatWrapper(superChat, user, )
    }

    handleOnline(num: number) {
        // store.commit("SET_POPULAR_NUM", num)
        store.dispatch("setPopularNum", num)
        console.log(num)
    }
}

let fetching: Array<number> = [];

export {DanmakuMsgHandlerItfc, DanmakuHandler, DanmakuWrapper, SendGiftWrapper, GuardBuyWrapper, SuperChatWrapper};
