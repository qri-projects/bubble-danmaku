import {fetchAsync} from "../../common/util";
import {GiftInfo} from "./giftInfo";
import {UserInDB} from "../../common/db";

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
        comboNum:number
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
    }

    user_id: number;
    user_name: string;
    user_face_url: string;

    // "silver" or "gold"
    coin_type: string;
    total_coin: number;

    gift: GiftInfo;
    gift_num: number;
    combo_id: string;
    combo_num:number;

    user: UserInDB;
}

function makeGiftEl(gift: SEND_GIFT, gifts: Map<number, GiftInfo>, user: UserInDB) {
    console.log(gift)
    let data = gift.data;
    return new GiftEl(
        data.uid,
        data.uname,
        data.face,
        user,
        data.coin_type,
        data.total_coin,
        gifts[data.giftId],
        data.num,
        data.batch_combo_id,
        data.super_gift_num
    );
}

export {makeGiftEl, GiftEl};
