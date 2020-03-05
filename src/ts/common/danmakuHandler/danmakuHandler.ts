import {Templates} from "../loadTemplate";
import DanmakuEl from "../../view/@type/DanmakuEl";
import {Config} from "../../config/config";
import DB, {UserInDB} from "../db";
import {fetchAsync} from "../util";

interface DanmakuMsgHandler {
    handleDanmaku(danmaku: DANMU_MSG): void;

    handleGift(sendGift: SEND_GIFT): void;

    handleGuard(guardBuy: GUARD_BUY): void;

    handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void;

    handleOnline(num:number);
}

let fetching: Array<number> = [];

function makeDanmakuHeadImgAndInsert(user: UserInDB, danmakuEl: DanmakuEl, templates: Templates, danmakuElQueue: Array<HTMLDivElement>) {
    if (user.nickName) {
        danmakuEl.favorite = true;
        danmakuEl.user_name = user.nickName;
    }
    danmakuEl.user_head_img = user.faceUrl;

    let elHtml = templates.danmakuTemplate(danmakuEl)
    let danmakuHtmlEl = document.createElement("div");
    danmakuHtmlEl.setAttribute("class", <string>danmakuEl.outer_div_class);
    danmakuHtmlEl.innerHTML = <string>elHtml;
    danmakuElQueue.push(danmakuHtmlEl);
}

function makeDanmakuMsgHandler(templates: Templates, config: Config, danmakuElQueue: Array<HTMLDivElement>, db: DB, popularNumHolder) {
    let danmakuMsgHandler: DanmakuMsgHandler = {
        handleDanmaku: async function (danmaku: DANMU_MSG): Promise<void> {
            let userId = danmaku.info["2"]["0"];
            let user = await db.readUserByIdAsync(userId);

            let danmakuEl = new DanmakuEl(danmaku, config, false);
            if (!user) {
                let response = await fetchAsync(`http://api.bilibili.com/x/space/acc/info?mid=${userId}&jsonp=jsonp`, {
                    method: "get",
                    headers: {
                        "Referer": `https://space.bilibili.com/${userId}`,
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
                    }
                })
                let data = response.data;
                user = {
                    birthday: data.birthday,
                    description: data.sign,
                    faceUrl: data.face,
                    id: data.mid,
                    name: data.name,
                    nickName: "",
                    topPhotoFileName: data.top_photo
                };
                db.addUserAsync(user);

            }
            makeDanmakuHeadImgAndInsert(user, danmakuEl, templates, danmakuElQueue);

        }, handleGift(sendGift: SEND_GIFT): void {
        }, handleGuard(guardBuy: GUARD_BUY): void {
        }, handleSuperChat(superChat: SUPER_CHAT_MESSAGE): void {
        },
        handleOnline(num: number) {
            popularNumHolder.innerText = num;
        }

    };
    return danmakuMsgHandler;
}


export default makeDanmakuMsgHandler;
export {DanmakuMsgHandler};
