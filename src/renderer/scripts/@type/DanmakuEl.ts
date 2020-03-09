import {Config} from "../../../common/config/config";
import {UserInDB} from "../db";

class DanmakuEl {
    constructor(danmakuJson: DANMU_MSG, config: Config, userInDB:UserInDB) {
        let info = danmakuJson.info
        this.privilegeType = info[7] || 0

        let medal = info["3"]
        if (medal == null || medal.length === 0) {
            this.medal_name = "";
            this.medal_room_id = 0;
            this.medal_level = 0;
        } else {
            this.medal_name = medal[1];
            this.medal_room_id = medal[3];
            this.medal_level = medal[0]
        }

        let user: DANMU_MSG_Info_User = info[2]
        this.user_id = user[0]


        let ul = info[4]
        this.user_level = ul[0]
        this.user_head_img = userInDB.faceUrl;

        this.content = info[1];
        this.prefix_file_name = config.prefixFileName[`${this.privilegeType}`];

        this.favorite = Boolean(userInDB.nickName);
        this.outer_div_class = `danmaku user_id_${this.user_id}${this.privilegeType ? " guard" : ""}${this.favorite ? " favorite" : ""}`;
        if (userInDB.nickName) {
            this.user_name = userInDB.nickName;
        }else{
            this.user_name = user[1]
        }
        if (this.favorite) {
            this.user_name_style = `color: ${config.favoriteUserNameColor} !important`
        } else if (this.privilegeType) {
            this.user_name_style = `color:${config.guardUserNameColor[this.privilegeType]} !important`
        } else {
            let color: String = config.userNameRandColors[Math.floor(Math.random() * config.userNameRandColors.length)];
            this.user_name_style = `color: ${color} !important`
        }
    }

    /**
     * 舰队类型,0为非舰队, 1总督, 2提督, 3舰长
     */
    privilegeType: number;

    medal_name: String;
    medal_room_id: number | string;
    medal_level: number;

    user_level: number;

    user_id: number;
    user_name: String;
    user_head_img: String;

    content: String;
    prefix_file_name: String;
    favorite: boolean;

    outer_div_class: String;
    user_name_style: String;
}

export default DanmakuEl;
