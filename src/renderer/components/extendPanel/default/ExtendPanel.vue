<template>
    <div id="bottom">
        <div id="popular">
            气人值:
            <span id="popularNum">{{ popularNum }}</span>
        </div>
        <div id="timer">{{ timeStr }}</div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator"
    import {Task, timerTask} from "../../../scripts/timerTask";
    import store from "../../../store";

    @Component
    export default class extends Vue {
        timeStr =  "";
        popularNum = 0;

        addTask() {
            let vue = this;

            timerTask.state["lastDate"] = new Date();
            let timerTemplate = store.state.config.timerTemplate;
            let setTimeTask = new Task(50, function() {
                let current = new Date();
                if (current.getSeconds() !== timerTask.state["lastDate"].getSeconds()) {
                    let tmp;
                    vue.timeStr = timerTemplate
                        .replace("year", current.getFullYear().toString())
                        .replace("month", (tmp = current.getMonth() + 1) < 10 ? "0" + tmp : tmp.toString())
                        .replace("day", (tmp = current.getDate()) < 10 ? "0" + tmp : tmp.toString())
                        .replace("hour", (tmp = current.getHours()) < 10 ? "0" + tmp : tmp.toString())
                        .replace("minute", (tmp = current.getMinutes()) < 10 ? "0" + tmp : tmp.toString())
                        .replace("second", (tmp = current.getSeconds()) < 10 ? "0" + tmp : tmp.toString());
                }
                timerTask.state["lastDate"] = current;
            }, "timerTask");
            timerTask.addTask(setTimeTask);
        }

        handleOnline(num: number) {
            this.popularNum = num;
            console.log("人气值:", num);
        }

        created(){
            this.addTask();
            this.$emit("set-handle-online", {"handleOnline":this.handleOnline})
        }
    }
</script>

<style scoped>

</style>
