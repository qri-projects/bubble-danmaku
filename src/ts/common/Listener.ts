import DMclientRE from "../bilive/dm_client_re";
import {DanmakuMsgHandler} from "./danmakuHandler/danmakuHandler";

class Listener {
    roomId: number;
    client: DMclientRE;
    danmakuMsgHandler: DanmakuMsgHandler;

    constructor(roomId: number, danmakuMsgHandler: DanmakuMsgHandler) {
        this.roomId = roomId;
        this.client = new DMclientRE({roomID: roomId})
        this.danmakuMsgHandler = danmakuMsgHandler;
    }

    listen() {
        this.client
            .on("DANMU_MSG", this.danmakuMsgHandler.handleDanmaku)
            .on("online", this.danmakuMsgHandler.handleOnline)
            .on("SEND_GIFT", this.danmakuMsgHandler.handleGift)
            .on("GUARD_BUY", this.danmakuMsgHandler.handleGuard)
            .on("SUPER_CHAT_MESSAGE", this.danmakuMsgHandler.handleGuard)
            .Connect()
    }
}

export default Listener;
