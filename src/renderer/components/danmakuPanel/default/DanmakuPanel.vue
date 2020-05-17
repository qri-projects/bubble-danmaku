<template>
    <div id="danmakuPanel">
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
    import InnerDanmakuPanel from "./DefaultInnerDanmakuPanel.vue";
    import {Task, timerTask} from "../../../scripts/timerTask";
    import {DanmakuWrapper, GuardBuyWrapper, SendGiftWrapper} from "../../../scripts/DanmakuHandler";
    import {getDefaultUser, getUserInfo} from "../../../scripts/util/getUserInfoUtil";
    @Component({
        components:{InnerDanmakuPanel}
    })
    export default class extends Vue {
        outerDanmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>();
        comboMap = new Map<string, number>();
        danmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>();

        async handleDanmaku(danmaku: DANMU_MSG): Promise<void> {
            console.log(danmaku)
            let user = await getUserInfo(danmaku.info["2"]["0"], danmaku.info["2"]["1"], "");
            if (!user) {
                user = getDefaultUser(danmaku.info["2"]["0"], danmaku.info["2"]["1"]);
            }
            this.danmakuQueue.push(new DanmakuWrapper(danmaku, user));
        }

        consumeDanmaku() {
            let danmaku = this.outerDanmakuQueue.shift();
            if (danmaku != null) {
                this.danmakuQueue.push(danmaku);
            }
        }

        addTask(){
            let vue = this;
            timerTask.state["perIntervalInsertDanmakuNum"] = 1;
            let launchTask = new Task(50, function() {
                for (let j = 0; j < timerTask.state["perIntervalInsertDanmakuNum"]; j++) {
                    vue.consumeDanmaku();
                }
            });
            let ajustLaunchSpeenTask = new Task(50, function() {
                // 调整速度, 使3秒消耗完
                let speed = vue.outerDanmakuQueue.length / 3;
                speed = Math.max(speed, 1);
                // 50为每秒最多insert的次数, 如果超出50的话, speed / 50会大于1, 即每次消耗danmaku时消耗不止一条
                timerTask.state["perIntervalInsertDanmakuNum"] = Math.ceil(speed / 50);
                launchTask.interval = Math.floor(
                    1000 / (speed / timerTask.state["perIntervalInsertDanmakuNum"]) / 20
                );
            });
            timerTask.addTask(launchTask);
            timerTask.addTask(ajustLaunchSpeenTask);
        }

        created(): void {
            this.comboMap.set("-1", -1);
            this.addTask();

            // 此步必需, 向父组件注册handleDanmaku方法; 此行之外的皆为内部实现
            this.$emit("set-handle-danmaku", {"handleDanmaku":this.handleDanmaku})
        }
    }
</script>

<style scoped>

</style>
