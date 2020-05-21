<template>
    <div>
        <danmaku v-if="dataType == 0" :data="data"></danmaku>
        <sendGift v-else-if="dataType == 1" :data="data" :giftNum="giftNum"></sendGift>
        <danmaku v-else-if="dataType == 2"></danmaku>
        <div v-else-if="dataType == 3">superchat</div>
    </div>
</template>

<script lang="ts">
    import {danmaku} from "./DanmakuComponent";
    import {sendGift} from "./SendGiftComponent"
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
            danmaku,
            sendGift
        }
    })
</script>

<style scoped>

</style>
