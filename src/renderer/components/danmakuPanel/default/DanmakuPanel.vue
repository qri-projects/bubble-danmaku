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
    @Component({
        components:{InnerDanmakuPanel}
    })
    export default class extends Vue {
        @Prop() danmakuQueue;
        @Prop() comboMap;
    }
</script>

<style scoped>

</style>
