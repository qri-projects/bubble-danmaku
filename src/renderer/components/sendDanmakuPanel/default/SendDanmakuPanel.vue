<template>
    <div id="sendDanmakuPanel" :class="sendDanmakuPanelActive?'sendDanmakuPanelActive':''">
        <textarea
                @focus="active(true)"
                @blur="active(false)"
            id="sendDanmakuInput"
            v-model="msg"
            @keydown.enter="send"
            :style="`color: ${msg.length <= 30 ? 'black' : 'red'}`"
        ></textarea>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import { ipcRenderer, session } from "electron";

    @Component
    export default class extends Vue {
        msg: string = "";
        sendDanmakuPanelActive = false;


        created() {
            ipcRenderer.send("createSendDanmaku", {
                roomId: this.$store.state.config.roomId,
                cookie: this.$store.state.cookie,
            });
        }

        active(active:boolean){
            this.sendDanmakuPanelActive = active;
        }

        send(e) {
            if (e) {
                e.preventDefault();
            }
            if (this.msg) {
                if (this.msg.length <= 30) {
                    let res = ipcRenderer.send("sendDanmaku", { msg: this.msg });
                    this.msg = "";
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    $scrollBarWidth: 8px;
    $resizeFixSize: 5px;
    $prefixWidth: 20px;
</style>
