<template>
    <div id="danmakuPanelHolder">
        <div id="danmakuPanelBg"></div>
        <div id="danmakuPanel">
            <danmaku v-for="danmaku in danmakuQueue" :data="danmaku" :key="`danmaku-${danmaku.danmaku.info['0']['4']}-${danmaku.danmaku.info['0']['5']}`"></danmaku>
            <div id="danmakuPanelBottom"></div>
        </div>
        <div id="bottom">
            <div id="popular">
                气人值:
                <span id="popularNum">{{ $store.state.popularNum }}</span>
            </div>
            <div id="timer"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import {danmaku} from "./DanmakuComponents";
    import Listener from "../scripts/DanmakuListener";
    import {DanmakuFilter} from "../scripts/DanmakuFilter";
    import {DanmakuHandler, DanmakuWrapper, GuardBuyWrapper, SendGiftWrapper} from "../scripts/DanmakuHandler";
    import store from "../store";
    import {timerTask, Task} from "../scripts/timerTask";

    let roomId = store.state.config.roomId;
    let danmakuQueue = new Array<DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper>();
    export default Vue.extend({
        name: "DanmakuPage",
        data() {
            return {
                listener: new Listener(roomId, new DanmakuFilter(), new DanmakuHandler(danmakuQueue)),
                danmakuQueue: new Array<DanmakuWrapper>(),
                sendGiftQueue: new Array<SendGiftWrapper>(),
                guardBuyQueue: new Array<GuardBuyWrapper>(),
                timeStr: ""
            };
        },
        methods: {
            consumeDanmaku() {
                let danmaku = danmakuQueue.shift();
                if (danmaku != null) {
                    if (danmaku instanceof DanmakuWrapper) {
                        this.danmakuQueue.push(danmaku);
                    } else if (danmaku instanceof SendGiftWrapper) {
                        this.sendGiftQueue.push(danmaku);
                    } else if (danmaku instanceof GuardBuyWrapper) {
                        this.guardBuyQueue.push(danmaku);
                    }
                }
            },
            addTask(){
                let vue = this;

                timerTask.state["lastDate"] = new Date;
                let timerTemplate = vue.$store.state.config.timerTemplate;
                let setTimeTask = new Task(50,function(){
                    let current = new Date();
                    if (current.getSeconds() !== timerTask.state["lastDate"].getSeconds()) {
                        let tmp;
                        vue.timeStr = timerTemplate
                            .replace("year", current.getFullYear().toString())
                            .replace("month", ((tmp = (current.getMonth() + 1)) < 10 ? "0" + tmp : tmp.toString()))
                            .replace("day", (tmp = current.getDate()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("hour", (tmp = current.getHours()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("minute", (tmp = current.getMinutes()) < 10 ? "0" + tmp : tmp.toString())
                            .replace("second", (tmp = current.getSeconds()) < 10 ? "0" + tmp : tmp.toString())
                    }
                    timerTask.state["lastDate"] = current;
                });
                timerTask.addTask(setTimeTask);

                timerTask.state["insertDanmakuInterval"] = 50;
                timerTask.state["perIntervalInsertDanmakuNum"] = 1;
                let launchTask = new Task(50, function () {
                    for (let j = 0; j < timerTask.state["perIntervalInsertDanmakuNum"]; j++) {
                        vue.consumeDanmaku();
                    }
                })
                let ajustLaunchSpeenTask = new Task(50, function(){
                    let speed = danmakuQueue.length / 3;
                    timerTask.state["perIntervalInsertDanmakuNum"] = Math.ceil(speed / 50);
                    timerTask.state["insertDanmakuInterval"] = Math.floor(1000 / (speed / timerTask.state["perIntervalInsertDanmakuNum"]) / 20);
                    launchTask.interval = timerTask.state["insertDanmakuInterval"];
                })
                timerTask.addTask(launchTask)
                timerTask.addTask(ajustLaunchSpeenTask)
            }
        },
        created() {
            this.listener.listen();
            this.addTask();
        },
        components: {danmaku: danmaku},
    });
</script>

<style scoped></style>
