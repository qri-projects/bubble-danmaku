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
                    "cookie": this.cookie,
                    "referer": "http://live.bilibili.com/336116",
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
