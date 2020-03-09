import store from "../store";

class DanmakuFilter {
    constructor() {
        let reStrings = store.state.config.filterRe;
        this.res = [];
        for (let re of reStrings) {
            console.log("re",re)
            this.res.push(new RegExp(re));
        }
        this.roomId = store.state.config.roomId;
    }

    res: Array<RegExp>;
    roomId: number;

    filterDanmaku(danmaku: DANMU_MSG) {
        let data = danmaku.info;

        // 抽奖弹幕屏蔽
        if (!store.state.config.showDrawDanmaku && data["0"]["9"] != 0) {
            return false;
        }

        // ul过低屏蔽
        let userLevel = data["4"]["0"];
        if (userLevel < store.state.config.userLevelUpperThan) {
            return false;
        }

        // 按牌子屏蔽
        if (store.state.config.medalLevelUpperThan > 0) {
            let medal = data["3"];
            if (medal == null) {
                return false;
            }
            if (medal["3"] != this.roomId) {
                return false;
            }
            if (medal["0"] < store.state.config.medalLevelUpperThan) {
                return false;
            }
        }

        // content正则屏蔽
        let content = data["1"];
        if (content) {
            for (let re of this.res) {
                if (re.test(content)) {
                    return false;
                }
            }
        }

        return true;
    }

    filterGift(gift: SEND_GIFT) {
        // 不显示礼物
        if (!store.state.config.showGift) {
            return false;
        }

        // 不显示银瓜子礼物
        if (!store.state.config.showSilverGift && gift.data.coin_type == "silver") {
            return false;
        }

        // 按瓜子数量屏蔽
        if (gift.data.total_coin < store.state.config.giftCoinUpperThan[gift.data.coin_type]) {
            return false;
        }

        return true;
    }
}

export {DanmakuFilter}
