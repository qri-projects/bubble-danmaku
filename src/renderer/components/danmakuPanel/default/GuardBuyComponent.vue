<template>
    <div class="gift">
        <div class="user">
            <img :src="user.faceUrl" alt="" class="headImgImg" @click="focusUser" />
            <outer-link :href="`https://space.bilibili.com/${user.id}`">
                <div class="userName">{{user.nickName?user.nickName:user.name}}</div>
            </outer-link>
        </div>
        <div class="send">开通</div>
        <img class="giftImg" :src="`${giftImg}`" />
        <div class="giftNum">
            <div class="mult">x&nbsp;</div>
            <div class="giftNumNumber">{{data.guardBuy.data.num}}</div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator"
    import {GuardBuyWrapper, SendGiftWrapper} from "../../../scripts/DanmakuHandler";
    import store from "../../../store";

    @Component
    export default class extends Vue {
        @Prop({type: GuardBuyWrapper}) data;

        get user(){
            return this.$store.getters.getUser(this.data.user.id);
        }

        get giftImg(){
            return `${this.$store.state.configPath}/src/image/${store.state.config.guardBuyGiftImgFileName[this.data.guardBuy.data.guard_level]}`;
        }

        focusUser(){
            this.$store.dispatch("SET_FOCUS_USER", {"userInDB":this.user});
        }
    }
</script>

<style scoped>

</style>
