<template>
    <div class="circleProcess" :style="`width:${width};height:${width};background-color:${color}`">
        <div
            class="right"
            :style="`background-color:${bgColor};transform:rotate(${process > 0.5 ? 180 : process * 360}deg)`"
        ></div>
        <div class="leftMask" :style="`background-color:${color}`"></div>
        <div class="left" v-if="process > 0.5" :style="`background-color:${bgColor};transform:rotate(${process * 360}deg)`"></div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";

    @Component
    export default class extends Vue {
        @Prop({ type: String }) width;
        @Prop({ type: String }) bgColor;
        @Prop({ type: String }) color;
        @Prop({ type: Number }) max;
        @Prop({ type: Number }) value;

        get process() {
            return this.value / this.max;
        }
    }
</script>

<style>
        .circleProcess .right {
            position: relative;
            width: 100%;
            margin-left: -50%;
            height: 100%;
            transform-origin: right center;
            z-index: 1;
            left: 0;
        }
        .circleProcess .leftMask{
            margin-top: -100%;
            position: relative;
            width: 50%;
            height: 100%;
            z-index: 2;
            left: 0;
        }
        .circleProcess .left{
            margin-top: -100%;
            left: 0;
            position: relative;
            width: 100%;
            margin-left: -50%;
            height: 100%;
            transform-origin: right center;
            z-index: 3;
        }
</style>
