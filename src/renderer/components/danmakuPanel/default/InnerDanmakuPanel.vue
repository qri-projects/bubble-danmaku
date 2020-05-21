<template>
    <div>
        <danmaku v-if="dataType == 0" :data="data"></danmaku>
        <send-gift v-else-if="dataType == 1" :data="data" :giftNum="giftNum"></send-gift>
        <danmaku v-else-if="dataType == 2"></danmaku>
        <inner-super-chat v-else-if="dataType == 3" :data="data"></inner-super-chat>
    </div>
</template>

<script lang="ts">
    import Danmaku from "./DanmakuComponent";
    import SendGift from "./SendGiftComponent"
    import InnerSuperChat from "./InnerSuperChatComponent";
    import {DanmakuWrapper, GuardBuyWrapper, SendGiftWrapper, SuperChatWrapper} from '../../../scripts/DanmakuHandler';
    import Vue from "vue"

    export default Vue.extend({
        name: "innerDanmakuPanel",
        props: ["data", "giftNum"],
        computed: {
            dataType() {
                if (this.data instanceof DanmakuWrapper) {
                    return 0;
                } else if (this.data instanceof SendGiftWrapper) {
                    return 1
                } else if (this.data instanceof GuardBuyWrapper) {
                    return 2
                } else if(this.data instanceof SuperChatWrapper){
                    return 3;
                }
                return -1;
            }
        },
        data() {
            return {
                type: -1
            }
        },
        components: {
            Danmaku,
            SendGift,
            InnerSuperChat
        }
    })
</script>

<style scoped>

</style>
