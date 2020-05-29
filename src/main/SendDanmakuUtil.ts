import querystring from "querystring";


export class SendDanmakuUtil {
    net;
    cookie: string;
    csrf: string;
    roomId: number;
    DATA = {
        color: 16777215,
        fontsize: 25,
        mode: 1,
        msg: "123",
        rnd: 1590426124,
        roomid: 336116,
        bubble: 0,
        csrf_token: "14f7adc44edf68a63848936c1e1633a4",
        csrf: "14f7adc44edf68a63848936c1e1633a4",
    };
    constructor(net, roomId: number, cookie: string) {
        this.net = net;
        this.cookie = cookie;
        this.csrf = cookie.split("bili_jct=")[1].split(";")[0];
        this.roomId = roomId;
    }

    createData(msg: string) {
        return {
            ...this.DATA,
            msg,
            csrf: this.csrf,
            csrf_token: this.csrf,
            roomid: this.roomId,
            // @ts-ignore
            rnd: parseInt(new Date().getTime() / 1000),
        };
    }

    createContent(msg: string){
        let data = this.createData(msg);
        return querystring.stringify(data);
    }

    sendDanmaku(msg:string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let content = this.createContent(msg);
            const request = this.net.request({
                "url": "http://api.live.bilibili.com/msg/send",
                "method": "POST",
                "headers": {
                    "content-length": content.length,
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "cookie":
                        "buvid3=1F3B3CE5-98CB-4FA4-9B4E-50D2D9CAD5A765977infoc; CURRENT_FNVAL=16; rpdid=|(u)~mkRR~~)0J'ullY~|mlY~; fts=1556709567; im_notify_type_13578650=0; gr_user_id=821ac168-3c0b-468e-97f1-ce429ac32161; grwng_uid=48916cfc-29e7-4d81-9cc0-cb5be7e5ff47; stardustvideo=1; stardustpgcv=0606; pgv_pvi=5015828480; LIVE_BUVID=9c6b98504ac8d65f4cb7cae6a5e62bbb; LIVE_BUVID__ckMd5=37a5ab78d68697f0; INTVER=1; deviceFingerprint=47d095644a344a6c7f7d25fa4c77d040; kfcSource=link; msource=pc_web; laboratory=1-1; _qddaz=QD.pj2vdu.xb0fd9.k4xz11r3; pgv_si=s5152249856; _ga=GA1.2.1161775591.1578327416; LIVE_PLAYER_TYPE=2; innersign=1; _uuid=0540CC9C-75B0-F1AE-ADD8-FB6026BD30D575622infoc; sid=6uavhs1c; DedeUserID=13578650; DedeUserID__ckMd5=c3145d4f678b9ac0; SESSDATA=a7a4a98a%2C1601305693%2C1361f*41; bili_jct=14f7adc44edf68a63848936c1e1633a4; from=ticket_home; bsource=seo_google; CURRENT_QUALITY=120; bp_article_offset_13578650=392101956888984855; bp_video_offset_13578650=393335815099332723; Hm_lvt_8a6e55dbd2870f0f5bc9194cddf32a02=1590279667,1590280457,1590434698,1590436199; Hm_lpvt_8a6e55dbd2870f0f5bc9194cddf32a02=1590436199; bp_t_offset_13578650=393468890358939713; _dfcaptcha=ca3dd5003d524b466cd8275161db76c5; PVID=18",
                    "referer": `http://live.bilibili.com/${this.roomId}`,
                    "user-agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
                },
            });
            request.write(content);
            request.on("response", resolve);
            request.end();
        });
    }
}
