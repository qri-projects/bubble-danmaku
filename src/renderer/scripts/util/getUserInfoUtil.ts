import {fetchAsync} from "../../../common/utils/util";
import {UserInDB} from "../db";

async function getUserInfo(userId: number, danmakuUserName: String = "", danmakuUserFace: String = ""): Promise<UserInDB> {
    let user = await window.db.readUserByIdAsync(userId);
    if (user) {
        let userUpdated = false;
        if (danmakuUserName && user.name != danmakuUserName) {
            // db里的name和danmaku的user的name不同
            user.name = danmakuUserName;
            userUpdated = true;
        }
        if (danmakuUserFace && danmakuUserFace != user.faceUrl) {
            user.faceUrl = danmakuUserFace;
            userUpdated = true;
        }
        if (userUpdated) {
            window.db.updateUserAsync(user);
        }
    }
    if (!user) {
        try {
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
            window.db.addUserAsync(user);
        } catch (ignored) {
        }
    }

    return user;
}

function getDefaultUser(userId: number = 13578650, userName: String = "完美潇洒的小黄瓜", userFace: String = "https://i0.hdslb.com/bfs/face/member/noface.jpg"): UserInDB {
    return {
        birthday: "06-21",
        description: "description",
        faceUrl: userFace,
        id: userId,
        name: userName,
        nickName: "nickName" + userName,
        topPhotoFileName: "http://i0.hdslb.com/bfs/space/24d0815514951bb108fbb360b04a969441079315.png"
    };
}

export {getUserInfo, getDefaultUser}
