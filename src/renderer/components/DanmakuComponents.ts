import Vue from "vue";
import store from "../store/index";
import {Config} from "../../common/config/config";
import {UserInDB} from "../scripts/db";
import {Component, Model, Prop} from "vue-property-decorator";
import {DanmakuWrapper} from "../scripts/DanmakuHandler";

// class DanmakuEl {
//     constructor(danmakuJson: DANMU_MSG, userInDB: UserInDB) {
//         let info = danmakuJson.info;
//         this.privilegeType = info[7] || 0;
//
//         let medal = info["3"];
//         if (medal == null || medal.length === 0) {
//             this.medalName = "";
//             this.medalRoomId = 0;
//             this.medalLevel = 0;
//         } else {
//             this.medalName = medal[1];
//             this.medalRoomId = medal[3];
//             this.medalLevel = medal[0];
//         }
//
//         let user: DANMU_MSG_Info_User = info[2];
//         this.userId = user[0];
//
//         let ul = info[4];
//         this.userLevel = ul[0];
//         this.userHeadImg = userInDB.faceUrl;
//
//         this.content = info[1];
//         this.prefixFileName = store.state.config.prefixFileName[`${this.privilegeType}`];
//
//         this.favorite = Boolean(userInDB.nickName);
//         if (userInDB.nickName) {
//             this.userName = userInDB.nickName;
//         } else {
//             this.userName = user[1];
//         }
//         if (this.favorite) {
//             this.userNameStyle = `color: ${store.state.config.favoriteUserNameColor} !important`;
//         } else if (this.privilegeType) {
//             this.userNameStyle = `color:${store.state.config.guardUserNameColor[this.privilegeType]} !important`;
//         } else {
//             let color: String =
//                 store.state.config.userNameRandColors[
//                     Math.floor(Math.random() * store.state.config.userNameRandColors.length)
//                     ];
//             this.userNameStyle = `color: ${color} !important`;
//         }
//     }
//
//     /**
//      * 舰队类型,0为非舰队, 1总督, 2提督, 3舰长
//      */
//     privilegeType: number;
//
//     medalName: String;
//     medalRoomId: number | string;
//     medalLevel: number;
//
//     userLevel: number;
//
//     userId: number;
//     userName: String;
//     userHeadImg: String;
//
//     content: String;
//     prefixFileName: String;
//     favorite: boolean;
//
//     userNameStyle: String;
// }

// @Component

// @Component
// class danmaku extends Vue{
//     @Prop(DanmakuWrapper) data;
//     public render(){
//
//     }
// }
let danmaku = Vue.extend({
    name: "danmaku",
    template: store.state.templates.danmakuTemplate,
    props: {
        "data": DanmakuWrapper,
    },
    data() {
        return {
            prefixFileName: "",
            userId: 123,
            userName: new String(),
            userHeadImg: new String(),
            medalLevel: 0,
            medalName: "小黄瓜",
            medalRoomId: 336119,
            userLevel: 0,
            userNameStyle: "",
            content: "",
            privilegeType: 0
        };
    },
    created() {
        let data: DanmakuWrapper = this.data;
        let danmakuMsg = data.danmaku;
        let user = data.user;
        let info = danmakuMsg.info;
        this.privilegeType = info[7] || 0;

        this.prefixFileName = store.state.config.prefixFileName[this.privilegeType];
        this.userId = user.id;
        this.userName = user.nickName ? user.nickName : user.name;
        this.userHeadImg = user.faceUrl;
        let medal = info["3"];
        if (medal != null && medal.length !== 0) {
            this.medalName = medal[1];
            this.medalRoomId = parseInt(`${medal[3]}`);
            this.medalLevel = medal[0];
        }
        this.userLevel = info["4"]["0"];
        if (user.nickName) {
            this.userNameStyle = `color: ${store.state.config.favoriteUserNameColor} !important`;
        } else if (this.privilegeType) {
            this.userNameStyle = `color:${store.state.config.guardUserNameColor[this.privilegeType]} !important`;
        } else {
            let color: String =
                store.state.config.userNameRandColors[
                    Math.floor(Math.random() * store.state.config.userNameRandColors.length)
                    ];
            this.userNameStyle = `color: ${color} !important`;
        }
        this.content = info[1]
    },
});

export {danmaku};
