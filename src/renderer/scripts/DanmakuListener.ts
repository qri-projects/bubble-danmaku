import DMclientRE from "../../common/bilive/dm_client_re";
import {DanmakuHandler} from "./DanmakuHandler";
import {DanmakuFilter} from "./DanmakuFilter";
import electron from "electron";
import {handleConfigLoaded} from "./configLoaded";
import store from "../store/index"


class Listener {
    roomId: number;
    client: DMclientRE;
    danmakuHandler: DanmakuHandler;
    danmakuFilter:DanmakuFilter;

    constructor(roomId: number, danmakuFilter:DanmakuFilter, danmakuHandler:DanmakuHandler) {
        this.roomId = roomId;
        this.client = new DMclientRE({roomID: roomId})
        this.danmakuFilter = danmakuFilter
        this.danmakuHandler = danmakuHandler
        this.client
            .on("DANMU_MSG", (data:DANMU_MSG)=>{
                if (this.danmakuFilter.filterDanmaku(data)) {
                    this.danmakuHandler.handleDanmaku(data)
                }
            })
            .on("SEND_GIFT", (data:SEND_GIFT)=>{
                if (this.danmakuFilter.filterGift(data)) {
                    this.danmakuHandler.handleGift(data)
                }
            })
            .on("online", (num:number)=>{
                this.danmakuHandler.handleOnline(num)
            })
            .on("GUARD_BUY", (guardBuy:GUARD_BUY)=>{this.danmakuHandler.handleGuard(guardBuy)})
            .on("SUPER_CHAT_MESSAGE", (superChat:SUPER_CHAT_MESSAGE)=>{this.danmakuHandler.handleSuperChat(superChat)});
        if (store.state.dev) {
            electron.ipcRenderer.on("testSuperChat", (event, superChatData) => {
                this.danmakuHandler.handleSuperChat(superChatData);
            });
            electron.ipcRenderer.on("testGuardBuy", (event, guardBuyData) => {
                this.danmakuHandler.handleGuard(guardBuyData);
            });
        }

    }

    listen() {
        this.client.Connect()
    }
}

export default Listener;
