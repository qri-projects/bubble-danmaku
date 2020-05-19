<template>
    <div id="danmakuPanelHolder">
        <div id="danmakuPanelBg"></div>
        <div id="mainPanel">
        <danmaku-panel :ref="`danmakuPanel`" @set-handle-danmaku="setHandleDanmaku" @set-handle-gift="setHandleGift" @set-add-danmaku="setAddDanmaku" />
        <super-chat-panel @add-to-danmaku-panel="addSuperChatToDanmakuPanel" @set-handle-super-chat="setHandleSuperChat" />
        </div>
        <extend-panel @set-handle-online="setHandleOnline" />
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
    const danmakuHandler = new DanmakuHandler();

    export default Vue.extend({
        name: "DanmakuPage",
        data() {
            return {
                danmakuHandler: danmakuHandler,
                listener: new Listener(roomId, new DanmakuFilter(), danmakuHandler),
                addDanmaku: (danmaku:DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper | SuperChatWrapper)=>{}
            };
        },
        methods: {
            setHandleDanmaku({ handleDanmaku = (danmaku: DANMU_MSG) => {} }) {
                this.danmakuHandler.handleDanmaku = handleDanmaku;
            },
            setHandleGift({ handleGift = (sendGift: SEND_GIFT) => {} }) {
                this.danmakuHandler.handleGift = handleGift;
            },
            setHandleSuperChat({ handleSuperChat = (superchat: SUPER_CHAT_MESSAGE) => {} }) {
                this.danmakuHandler.handleSuperChat = handleSuperChat;
            },
            setHandleOnline({handleOnline = (num:number)=>{}}){
                this.danmakuHandler.handleOnline = handleOnline;
            },
            setAddDanmaku({addDanmaku = (danmaku:DanmakuWrapper | SendGiftWrapper | GuardBuyWrapper | SuperChatWrapper)=>{}}){
                this.addDanmaku = addDanmaku;
            },

            addSuperChatToDanmakuPanel(payload : {superChatWrapper:SuperChatWrapper}){
                this.addDanmaku(payload.superChatWrapper);
            }
        },
        created() {
            this.listener.listen();
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
            "ExtendPanel": () => {
                if (store.state.config.extendPanelComponentName == "default") {
                    return import("./extendPanel/default/ExtendPanel.vue");
                }
            },
        },
    });
</script>

<style scoped></style>
