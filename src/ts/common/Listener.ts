import DMclientRE from "../bilive/dm_client_re";
import {BrowserWindow} from 'electron';

import MyGlobalD from "../@types/MyGlobal";

class Listener{
    listen(roomId:number) {
        setTimeout(() => {

        let client = new DMclientRE({roomID: roomId})
        client
            .on("DANMU_MSG", this.sendDanmakuToView)
            .Connect()
        }, 0)
    }

    sendDanmakuToView(dataJson: danmuJson) {
        (<MyGlobalD><unknown>global).mainWindow.webContents.send(dataJson.cmd, dataJson)
    }
}

export default Listener;
