import {fetchAsync, requestGetAsync} from "../../../common/util";
import get = Reflect.get;

interface GiftInfo {
    id: 6
    name: "亿圆"
    price: 1000
    type: 0
    coin_type: "silver"
    bag_gift: 1
    effect: 0
    corner_mark: ""
    corner_background: ""
    broadcast: 0
    draw: 0
    stay_time: 3
    animation_frame_num: 12
    desc: "虽然只要1元，但是四舍五入之后就值一个亿啊。"
    rule: ""
    rights: ""
    privilege_required: 0
    count_map: [{ num: 1, text: "" }]
    img_basic: "https://s1.hdslb.com/bfs/live/592e81002d20699c7e4dae4480ada79ab3253eae.png"
    img_dynamic: "https://i0.hdslb.com/bfs/live/592e81002d20699c7e4dae4480ada79ab3253eae.png"
    frame_animation: "https://i0.hdslb.com/bfs/live/d97ead07024510e3d0aa9d4e1fdb6a9af8fec2b0.png"
    gif: "https://i0.hdslb.com/bfs/live/e9a7971219a6f6d9ad641dad5019a7ddcef40d47.gif"
    webp: "https://i0.hdslb.com/bfs/live/840aa8e74326905b73453d950ce73871ee5d1818.webp"
    full_sc_web: ""
    full_sc_horizontal: ""
    full_sc_vertical: ""
    full_sc_horizontal_svga: ""
    full_sc_vertical_svga: ""
    bullet_head: ""
    bullet_tail: ""
    limit_interval: 0
    bind_ruid: 0
    bind_roomid: 0
    bag_coin_type: 0
    broadcast_id: 0
    draw_id: 0
    gift_type: 0
    weight: 0
    max_send_limit: 0
    combo_resources_id: 0
}
async function fetchGiftInfoAsync(){
    let res =  await fetchAsync("https://api.live.bilibili.com/gift/v4/Live/giftConfig?platform=pc", {
        method: "get",
        headers: {
            "Referer": `https://live.bilibili.com/1`,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
        },
        mode:'no-cors'
    })
    return res.data.list;
}

async function requestGiftInfoAsync() {
    let option = {
        url: "https://api.live.bilibili.com/gift/v4/Live/giftConfig?platform=pc",
    }
    let res =  await requestGetAsync(option);
    return res.data.list;
}
export {GiftInfo, fetchGiftInfoAsync, requestGiftInfoAsync}
