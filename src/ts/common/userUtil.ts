import {fetchAsync} from "./util";
import DB from "./db";

async function getUser(userId:number, db: DB) {
    let user = await db.readUserByIdAsync(userId);
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
    return user;
}

export {getUser};
