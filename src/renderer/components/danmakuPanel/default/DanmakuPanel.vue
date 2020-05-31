<template>
    <div id="danmakuPanel">
        <user-detail></user-detail>
        <inner-danmaku-panel
                v-for="danmaku in danmakuQueue"
                :key="danmaku.key"
                :data="danmaku"
                :gift-num="comboMap.get(danmaku.comboId)"
        ></inner-danmaku-panel>
        <div id="danmakuPanelBottom"></div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator"
    import InnerDanmakuPanel from "./InnerDanmakuPanel.vue";
    import {Task, timerTask} from "../../../scripts/timerTask";
    import {DanmakuWrapper, GuardBuyWrapper, SendGiftWrapper, SuperChatWrapper} from "../../../scripts/DanmakuHandler";
    import {getDefaultUser, getUserInfo} from "../../../scripts/util/getUserInfoUtil";
    import UserDetail from "./UserDetail.vue";
    import {UserInDB, UserInDBMedal} from "../../../scripts/db";

    @Component({
        components: {
            InnerDanmakuPanel,
            UserDetail
        }
    })
    export default class extends Vue {
        // 消息一收到, 就往outerDanmakuQueue里填.
        // 因为b站推送的弹幕消息, 是一波一波的
        // 一波可能会有一大片, 如果收到消息就往view层填, 会显得极其不顺滑.
        // 所以按一定速率把outerDanmakuQueue里的消息填到danmakuQueue里
        // danmakuQueue里的消息会反应到view层
        outerDanmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper | SuperChatWrapper>();
        danmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper | SuperChatWrapper>();

        comboMap = new Map<string, number>();

        focusUser: UserInDB | null = null;

        addDanmaku(danmaku: DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper | SuperChatWrapper) {
            this.outerDanmakuQueue.push(danmaku);
        }

        async handleDanmaku(danmaku: DANMU_MSG): Promise<void> {
            let medal: UserInDBMedal = new UserInDBMedal(danmaku.info["3"]["0"], danmaku.info["3"]["1"], danmaku.info["3"]["2"], danmaku.info["3"]["3"]);
            let user = await getUserInfo(danmaku.info["2"]["0"], danmaku.info["2"]["1"], "", medal, danmaku.info["4"]["0"], danmaku.info[7]);
            if (user == null) {
                console.error("danmaku user null, data: ", danmaku);
            } else {
                this.addDanmaku(new DanmakuWrapper(danmaku, user));
            }
        }

        async handleGift(sendGift: SEND_GIFT): Promise<void> {
            let user = await getUserInfo(sendGift.data.uid, sendGift.data.uname, sendGift.data.face, null, null, sendGift.data.guard_level);
            let comboId = sendGift.data.batch_combo_id;
            if (comboId) {
                if (!this.comboMap.has(comboId)) {
                    if (user == null) {
                        console.error("gift user null, data: ", sendGift);
                    } else {
                        this.outerDanmakuQueue.push(new SendGiftWrapper(sendGift, user, comboId));
                    }
                }
                if (sendGift.data.super_gift_num) {
                    this.comboMap.set(comboId, sendGift.data.super_gift_num);
                } else {
                    this.comboMap.set(comboId, sendGift.data.num);
                }
            } else {
                if (user == null) {
                    console.error("gift user null, data: ", sendGift);
                } else {
                    this.outerDanmakuQueue.push(new SendGiftWrapper(sendGift, user, "-1"));
                }
            }
        }

        async handleGuardBuy(guardBuy: GUARD_BUY) {
            let user = await getUserInfo(guardBuy.data.uid, guardBuy.data.username, "", null, null, null);
            if (user == null) {
                console.error("guard user null, data: ", guardBuy);
            } else {
                let guardBuyWrapper = new GuardBuyWrapper(guardBuy, user);
                this.outerDanmakuQueue.push(guardBuyWrapper);
            }
        }

        consumeDanmaku() {
            let danmaku = this.outerDanmakuQueue.shift();
            if (danmaku != null) {
                this.danmakuQueue.push(danmaku);
            }
        }

        addTask() {
            // 按一定速率把outerDanmakuQueue中的消息往danmakuQueue中填
            let vue = this;
            timerTask.state["perIntervalInsertDanmakuNum"] = 1;
            let launchTask = new Task(50, function () {
                for (let j = 0; j < timerTask.state["perIntervalInsertDanmakuNum"]; j++) {
                    vue.consumeDanmaku();
                }
            }, "consumeDanmakuTask");
            let adjustLaunchSpeedTask = new Task(50, function () {
                // 调整速度, 使3秒消耗完
                let speed = vue.outerDanmakuQueue.length / 3;
                speed = Math.max(speed, 1);
                // 50为每秒最多insert的次数, 如果超出50的话, speed / 50会大于1, 即每次消耗danmaku时消耗不止一条
                timerTask.state["perIntervalInsertDanmakuNum"] = Math.ceil(speed / 50);
                launchTask.interval = Math.floor(
                    (1000 / (speed / timerTask.state["perIntervalInsertDanmakuNum"])) / 20
                );
            }, "adjustLaunchSpeedTask");
            timerTask.addTask(launchTask);
            timerTask.addTask(adjustLaunchSpeedTask);
        }

        created(): void {
            this.comboMap.set("-1", -1);
            this.addTask();

            // 此步必需, 向父组件注册方法; 这几行之外的皆为内部实现可随意调整
            this.$emit("set-handle-danmaku", {"handleDanmaku": this.handleDanmaku})
            this.$emit("set-handle-gift", {"handleGift": this.handleGift})
            this.$emit("set-handle-guard-buy", {"handleGuardBuy": this.handleGuardBuy});
            this.$emit("set-add-danmaku", {"addDanmaku": this.addDanmaku});
        }
    }
</script>

<style scoped>

</style>
