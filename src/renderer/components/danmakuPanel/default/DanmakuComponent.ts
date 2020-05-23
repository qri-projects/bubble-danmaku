import Vue from "vue";
import store from "../../../store";
import {Config} from "../../../../common/config/config";
import {UserInDB} from "../../../scripts/db";
import {Component, Model, Prop} from "vue-property-decorator";
import {DanmakuWrapper} from "../../../scripts/DanmakuHandler";
import {getDefaultUser} from "../../../scripts/util/getUserInfoUtil";

let Danmaku = Vue.extend({
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
            privilegeType: 0,
            user: getDefaultUser()
        };
    },
    methods:{
        focusUser(){
            store.dispatch("SET_FOCUS_USER", {"userInDB":this.user});
        }
    },
    created() {
        let data: DanmakuWrapper = this.data;
        let danmakuMsg = data.danmaku;
        let user = data.user;
        this.user = user;
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

export default Danmaku;
