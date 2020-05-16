<template>
    <div id="danmakuPanelHolder">
        <div id="danmakuPanelBg"></div>
        <danmaku-panel :danmaku-queue="danmakuQueue" :combo-map="comboMap" />
        <div id="scPanel"></div>
        <div id="bottom">
            <div id="popular">
                气人值:
                <span id="popularNum">{{ $store.state.popularNum }}</span>
            </div>
            <div id="timer">{{ timeStr }}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    import Listener from "../scripts/DanmakuListener";
    import { DanmakuFilter } from "../scripts/DanmakuFilter";
    import { DanmakuHandler, DanmakuWrapper, GuardBuyWrapper, SendGiftWrapper } from "../scripts/DanmakuHandler";
    import store from "../store";
    import { timerTask, Task } from "../scripts/timerTask";
    import DanmakuPanel from "./danmakuPanel/default/DanmakuPanel.vue";

    let roomId = store.state.config.roomId;
    let danmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>();
    const comboMap = new Map<string, number>();
    comboMap.set("-1", -1);

    export default Vue.extend({
        name: "DanmakuPage",
        data() {
            return {
                comboMap: comboMap,
                listener: new Listener(roomId, new DanmakuFilter(), new DanmakuHandler(danmakuQueue, comboMap)),
                danmakuQueue: new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>(),
                timeStr: "",
            };
        },
        watch: {
            // comboMap: {
            //     handler: function (n, o) {
            //         console.log("o", o)
            //         console.log("n", n)
            //     },
            //     deep:true
            // }
        },
        methods: {
            consumeDanmaku() {
                let danmaku = danmakuQueue.shift();
                if (danmaku != null) {
                    this.danmakuQueue.push(danmaku);
                    // if (danmaku instanceof DanmakuWrapper) {
                    //     this.danmakuQueue.push(danmaku);
                    // } else if (danmaku instanceof SendGiftWrapper) {
                    //     this.sendGiftQueue.push(danmaku);
                    // } else if (danmaku instanceof GuardBuyWrapper) {
                    //     this.guardBuyQueue.push(danmaku);
                    // }
                }
            },
            addTask() {
                let vue = this;

                timerTask.state["lastDate"] = new Date();
                let timerTemplate = store.state.config.timerTemplate;
                let setTimeTask = new Task(50, function() {
                    let current = new Date();
                    if (current.getSeconds() !== timerTask.state["lastDate"].getSeconds()) {
                        let tmp;
                        vue.timeStr = timerTemplate
                            .replace("year", current.getFullYear().toString())
                            .replace("month", (tmp = current.getMonth() + 1) < 10 ? "0" + tmp : tmp.toString())
                            .replace("day", (tmp = current.getDate()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("hour", (tmp = current.getHours()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("minute", (tmp = current.getMinutes()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("second", (tmp = current.getSeconds()) < 10 ? "0" + tmp : tmp.toString());
                    }
                    timerTask.state["lastDate"] = current;
                });
                timerTask.addTask(setTimeTask);

                timerTask.state["perIntervalInsertDanmakuNum"] = 1;
                let launchTask = new Task(50, function() {
                    for (let j = 0; j < timerTask.state["perIntervalInsertDanmakuNum"]; j++) {
                        vue.consumeDanmaku();
                    }
                });
                let ajustLaunchSpeenTask = new Task(50, function() {
                    // 调整速度, 使3秒消耗完
                    let speed = danmakuQueue.length / 3;
                    speed = Math.max(speed, 1);
                    // 50为每秒最多insert的次数, 如果超出50的话, speed / 50会大于1, 即每次消耗danmaku时消耗不止一条
                    timerTask.state["perIntervalInsertDanmakuNum"] = Math.ceil(speed / 50);
                    launchTask.interval = Math.floor(
                        1000 / (speed / timerTask.state["perIntervalInsertDanmakuNum"]) / 20
                    );
                });
                timerTask.addTask(launchTask);
                timerTask.addTask(ajustLaunchSpeenTask);
            },
        },
        created() {
            this.listener.listen();
            this.addTask();
        },
        components: {
            "DanmakuPanel": () => {
                if (store.state.config.danmakuPanelComponentName == "default") {
                    return import(`./danmakuPanel/default/DanmakuPanel.vue`);
                }
                alert("不存在的danmakuPanelComponent");
            },
        },
    });
</script>

<style scoped></style>
