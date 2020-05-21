import store from "../../../store";
import Vue from "vue";
import { SendGiftWrapper } from "../../../scripts/DanmakuHandler";
import { GiftInfo } from "../../../scripts/@type/giftInfo";

let sendGift = Vue.extend({
    name: "sendGift",
    template: store.state.templates.sendGiftTemplate,
    props: {
        data: SendGiftWrapper,
        giftNum: Number,
    },
    data() {
        return {
            userId: 123321,
            userFaceUrl: "",
            userName: "",
            giftImg: "",
            giftNumber:1
        };
    },
    created() {
        let data: SendGiftWrapper = this.data;
        let sendGift = data.sendGift;
        let giftData = sendGift.data;
        this.userId = data.user.id;
        this.userFaceUrl = sendGift.data.face;
        this.userName = giftData.uname;
        let gift: GiftInfo = store.state.gifts[giftData.giftId];
        if (gift.gif) {
            this.giftImg = gift.gif;
        } else {
            this.giftImg = gift.img_basic;
        }
        if (this.giftNum == -1) {
            this.giftNumber = giftData.num;
        }else{
            this.giftNumber = this.giftNum;
        }
    },
});

export {sendGift};
