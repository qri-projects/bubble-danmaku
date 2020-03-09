<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import {handleConfigLoaded} from "./scripts/configLoaded"
    import electron from "electron";
    import Vue from 'vue';

    export default Vue.extend({
        name: 'bili-danmaku-electron-vue',
        data() {
            return {
            }
        },
        created(): void {
            electron.ipcRenderer.on("configLoaded", (event) => {
                handleConfigLoaded()
            });
        }
    });
</script>

<style>
    /* CSS */
</style>
