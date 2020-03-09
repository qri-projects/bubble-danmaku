import {GiftInfo} from "./giftInfo";
import {UserInDB} from "../db";

class GiftEl {
    constructor(
        userId: number,
        userName: string,
        userFaceUrl: string,
        user: UserInDB,
        coinType: string,
        totalCoin: number,
        gift: GiftInfo,
        giftNum: number,
        comboId: string,
        comboNum: number,
        outer_div_class: string
    ) {
        this.user_id = userId;
        this.user_name = userName;
        this.coin_type = coinType;
        this.total_coin = totalCoin;
        this.gift = gift;
        this.gift_num = giftNum;
        this.combo_id = comboId;
        this.user_face_url = userFaceUrl;
        this.combo_num = comboNum;
        this.user = user;

        this.gift_img = gift.gif ? gift.gif : gift.img_basic
        this.outer_div_class = outer_div_class
    }

    user_id: number;
    user_name: string;
    user_face_url: string;

    // "silver" or "gold"
    coin_type: string;
    total_coin: number;

    gift: GiftInfo;
    gift_num: number;
    gift_img: string;
    combo_id: string;
    combo_num: number;

    user: UserInDB;

    outer_div_class: string;
}

function makeGiftEl(gift: SEND_GIFT, gifts: Map<number, GiftInfo>, user: UserInDB) {
    console.log(gift)
    let data = gift.data;
    let num;
    if (data.super_gift_num) {
        num = data.super_gift_num
    }else{
        num = data.num;
    }
    let outerDivClass = "gift";
    let comboId = data.batch_combo_id;
    comboId = comboId.replace(/:/g,"-").replace(/\./g, "_")
    return new GiftEl(
        data.uid,
        data.uname,
        data.face,
        user,
        data.coin_type,
        data.total_coin,
        gifts[data.giftId],
        num,
        comboId,
        data.super_gift_num,
        outerDivClass
    );
}

export {makeGiftEl, GiftEl};
