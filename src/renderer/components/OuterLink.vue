<template>
    <a :href="href" :alt="alt" @click="openOuter">
        <slot/>
    </a>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator"
    import {shell} from "electron"
    @Component
    export default class extends Vue {
        @Prop({type:String}) href;
        @Prop({type:String}) alt;
        openOuter(e){
            e.preventDefault();
            shell.openExternal(this.href);
        }
    }
</script>

<style scoped>

</style>
