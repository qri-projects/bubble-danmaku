import {fetchAsync} from "../../../common/util";
import {UserInDB} from "../db";

async function getUserInfo(userId:number) {
    let user = await window.db.readUserByIdAsync(userId);
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
        }catch (ignored) {}
    }
    return user;
}

function getDefaultUser(userId:number, userName:string):UserInDB {
    return {
        birthday: "",
        description: "",
        faceUrl: "",
        id: userId,
        name: userName,
        nickName: "",
        topPhotoFileName: ""
    };
}

export {getUserInfo, getDefaultUser}
