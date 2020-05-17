<template>
    <div id="danmakuPanelHolder">
        <div id="danmakuPanelBg"></div>
        <danmaku-panel :ref="`danmakuPanel`" @set-handle-danmaku="setHandleDanmaku" />
        <super-chat-panel />
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
    import {
        DanmakuHandler,
        DanmakuWrapper,
        GuardBuyWrapper,
        SendGiftWrapper,
        SuperChatWrapper,
    } from "../scripts/DanmakuHandler";
    import store from "../store";
    import { timerTask, Task } from "../scripts/timerTask";

    let roomId = store.state.config.roomId;
    let superChatQueue = new Array<SuperChatWrapper>();
    const danmakuHandler = new DanmakuHandler();

    export default Vue.extend({
        name: "DanmakuPage",
        data() {
            return {
                danmakuHandler: danmakuHandler,
                listener: new Listener(roomId, new DanmakuFilter(), danmakuHandler),
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
            },
            setHandleDanmaku({ handleDanmaku = (danmaku: DANMU_MSG) => {} }) {
                this.danmakuHandler.handleDanmaku = handleDanmaku;
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
            "SuperChatPanel": () => {
                if (store.state.config.superChatPanelComponentName == "default") {
                    return import("./superChatPanel/default/SuperChatPanel.vue");
                }
                alert("不存在的superChatPanelComponent");
            },
        },
    });
</script>

<style scoped></style>
