import { Component, Prop, Vue } from "vue-property-decorator";
import { SendGiftWrapper } from "../../../scripts/DanmakuHandler";
import { GiftInfo } from "../../../scripts/@type/giftInfo";
import store from "../../../store";

@Component({
    template: store.state.templates.sendGiftTemplate,
})
export default class extends Vue {
    @Prop({ type: SendGiftWrapper }) data;
    @Prop({ type: Number }) giftNum;

    get user() {
        return this.$store.getters.getUser(this.data.user.id);
    }

    get giftData() {
        let sendGift = this.data.sendGift;
        return sendGift.data;
    }

    get giftRaw() {
        return this.$store.state.gifts[this.giftData.giftId];
    }

    get giftImg() {
        if (this.giftRaw.gif) {
            return this.giftRaw.gif;
        } else {
            return this.giftRaw.img_basic;
        }
    }

    get giftNumber() {
        if (this.giftNum == -1) {
            return this.giftData.num;
        } else {
            return this.giftNum;
        }
    }

    focusUser() {
        store.dispatch("SET_FOCUS_USER", { "userInDB": this.user });
    }
}
