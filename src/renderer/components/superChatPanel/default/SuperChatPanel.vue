<template>
    <div id="superChatPanel">
        <div id="superChatQueueHolder">
            <super-chat-queue-item v-for="superChatData in superChatQueue" :super-chat-data="superChatData" @mouseenter.native="focusSuperChat(superChatData)" @mouseleave.native="clearFocusedSuperChat"></super-chat-queue-item>
        </div>
        <div v-if="displaySuperChat" id="displaySuperChatHolder">
            <super-chat :super-chat-data="displaySuperChat"></super-chat>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { SuperChatWrapper } from "../../../scripts/DanmakuHandler";
    import { getDefaultUser, getUserInfo } from "../../../scripts/util/getUserInfoUtil";
    import { Task, timerTask } from "../../../scripts/timerTask";
    import {SuperChat} from "./SuperChatComponent";
    import {SuperChatQueueItem} from "./SuperChatQueueItemComponent";

    @Component({
        components:{SuperChat,SuperChatQueueItem}
    })
    export default class extends Vue {
        superChatQueue = new Array<SuperChatWrapper>();
        displaySuperChat: null|SuperChatWrapper = null;

        created(): void {
            this.$emit("set-handle-super-chat", {"handleSuperChat":this.handleSuperChat})
        }

        async handleSuperChat(superChat: SUPER_CHAT_MESSAGE) {
            let vue = this;
            console.log(superChat);

            // 构造superChatWrapper
            let user = await getUserInfo(
                superChat.data.uid,
                superChat.data.user_info.uname,
                superChat.data.user_info.face
            );
            if (!user) {
                user = getDefaultUser(
                    superChat.data.uid,
                    superChat.data.user_info.uname,
                    superChat.data.user_info.face
                );
            }
            let superChatWrapper = new SuperChatWrapper(superChat, user);

            // 切换展示的SuperChat
            this.focusSuperChat(superChatWrapper);

            // 5秒后取消展示, 并在弹幕栏添加
            setTimeout(()=>{
                if (this.displaySuperChat == superChatWrapper) {
                    vue.clearFocusedSuperChat()
                }
                this.$emit("add-to-danmaku-panel", {superChatWrapper});
            }, 5000)

            // 添加到superChatQueue中, 按剩余时长排序
            let insertIndex = 0;
            for (; insertIndex < this.superChatQueue.length; insertIndex++) {
                let innerSuperChat = this.superChatQueue[insertIndex];
                if (innerSuperChat.remainTime < superChatWrapper.remainTime) {
                    break;
                }
            }
            this.superChatQueue.splice(insertIndex, 0, superChatWrapper);

            // 添加task, 每秒减少remainTime
            let task = new Task(
                50,
                () => {
                    superChatWrapper.remainTime -= 1;
                },
                superChatWrapper.key
            );
            timerTask.addTask(task);

            // sc结束时, 移除task, 从superchatQueue中移除
            setTimeout(() => {
                timerTask.removeTask(task);

                for (let superChatIndex = 0; superChatIndex < this.superChatQueue.length; superChatIndex++) {
                    let innerSuperChat = this.superChatQueue[superChatIndex];
                    if (innerSuperChat == superChatWrapper) {
                        this.superChatQueue.splice(superChatIndex, 1);
                        break;
                    }
                }
            }, superChat.data.time * 1000);
        }

        focusSuperChat(superChat:SuperChatWrapper){
            this.displaySuperChat = superChat;
            console.log("focusaaaaaaa")
        }

        clearFocusedSuperChat(){
            this.displaySuperChat = null;
        }
        ccc(){
            console.log(123321123123123)
        }

    }
</script>

<style scoped></style>
