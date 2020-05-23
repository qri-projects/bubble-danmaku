import {fetchAsync} from "../../../common/utils/util";
import {UserInDB, UserInDBMedal, userInDBMedalEqual} from "../db";
import store from "../../store";

async function getUserInfo(userId: number, danmakuUserName: String = "", danmakuUserFace: String = "", medal: UserInDBMedal | null = null, userLevel: Number | null = null, guardLevel:Number|null): Promise<UserInDB> {
    if (store.state.usersCache.hasOwnProperty(userId)) {
        return store.state.usersCache[userId];
    }
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
        if (medal != null && !userInDBMedalEqual(medal, user.medal)) {
            user.medal = medal;
            userUpdated = true;
        }
        if (userLevel != user.userLevel) {
            user.userLevel = userLevel;
            userUpdated = true;
        }
        if(guardLevel != user.guardLevel){
            user.guardLevel = guardLevel;
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
                topPhotoFileName: data.top_photo,
                medal,
                userLevel: userLevel,
                guardLevel: guardLevel
            };
            window.db.addUserAsync(user);
        } catch (ignored) {
        }
    }
    store.dispatch("SET_USER_IN_CACHE", {user});
    return user;
}

function getDefaultUser(userId: number = 13578650, userName: String = "完美潇洒的小黄瓜", userFace: String = "https://i0.hdslb.com/bfs/face/member/noface.jpg"): UserInDB {
    return {
        birthday: "06-21",
        description: "这是一个非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常非常长的简介",
        faceUrl: userFace,
        id: userId,
        name: userName,
        nickName: "nickName" + userName,
        topPhotoFileName: "http://i0.hdslb.com/bfs/space/24d0815514951bb108fbb360b04a969441079315.png",
        medal: {
            medalName: "沙月",
            medalLevel: 14,
            liverName: "沙月酱",
            roomId: 4767523
        },
        userLevel: 16,
        guardLevel:1
    };
}

export {getUserInfo, getDefaultUser}
