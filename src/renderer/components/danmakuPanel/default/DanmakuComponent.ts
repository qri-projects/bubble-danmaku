import {Component, Prop, Vue} from "vue-property-decorator";
import store from "../../../store";
import {DanmakuWrapper, SuperChatWrapper} from "../../../scripts/DanmakuHandler";
import {getUserInfo} from "../../../scripts/util/getUserInfoUtil";

@Component({
    template: store.state.templates.danmakuTemplate,
})
class Danmaku extends Vue {
    @Prop({ type: DanmakuWrapper }) data;

    get user(){
        return this.$store.getters.getUser(this.data.user.id);
    }

    get privilegeType(){
        return this.data.danmaku.info[7] || 0;
    }

    get prefixFileName() {
        return store.state.config.prefixFileName[this.privilegeType];
    }

    get userNameStyle(){
        if (this.user.nickName) {
            return `color: ${store.state.config.favoriteUserNameColor} !important`;
        } else if (this.privilegeType) {
            return `color:${store.state.config.guardUserNameColor[this.privilegeType]} !important`;
        } else {
            let color: String =
                store.state.config.userNameRandColors[
                    Math.floor(Math.random() * store.state.config.userNameRandColors.length)
                    ];
            return `color: ${color} !important`;
        }
    }

    focusUser(){
        this.$store.dispatch("SET_FOCUS_USER", {"userInDB":this.user});
    }
}

export default Danmaku;
