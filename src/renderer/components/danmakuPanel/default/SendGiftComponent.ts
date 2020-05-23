import {Component, Prop, Vue} from "vue-property-decorator";
import {SendGiftWrapper} from "../../../scripts/DanmakuHandler";
import {GiftInfo} from "../../../scripts/@type/giftInfo";
import store from "../../../store";

@Component({
    template: store.state.templates.sendGiftTemplate,
    }
)
export default class extends Vue {
    @Prop({type: SendGiftWrapper}) data;
    @Prop({type: Number}) giftNum;

    get user(){
        return this.$store.getters.getUser(this.data.user.id);
    }

    get giftData(){
        let sendGift = this.data.sendGift;
        return sendGift.data;
    }

    get giftImg(){

        let gift: GiftInfo = store.state.gifts[this.giftData.giftId];
        if (gift.gif) {
            return gift.gif;
        } else {
            return gift.img_basic;
        }
    }

    get giftNumber(){
        if (this.giftNum == -1) {
            return this.giftData.num;
        }else{
            return this.giftNum;
        }
    }

    focusUser(){
        store.dispatch("SET_FOCUS_USER", {"userInDB":this.user});
    }
}
