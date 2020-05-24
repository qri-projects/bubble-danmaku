<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import {handleConfigLoaded} from "./scripts/configLoaded"
    import electron from "electron";
    import Vue from 'vue';
    import store from "./store";

    const emptyFunction = (...args) => {};
    if (!store.state.dev) {
        window.console.debug = emptyFunction;
        window.console.error = emptyFunction;
        window.console.info = emptyFunction;
        window.console.log = emptyFunction;
        window.console.warn = emptyFunction;
        window.console.dir = emptyFunction;
    }

    export default Vue.extend({
        name: 'bili-danmaku-electron-vue',
        data() {
            return {
            }
        },
        created(): void {
        }
    });
</script>

<style>
    /* CSS */
</style>
