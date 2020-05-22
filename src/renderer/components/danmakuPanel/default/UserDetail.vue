<template>
    <div id="userDetail" v-show="!!user">
        <div id="top">
            <div id="headImgHolder">
                <img :src="user.faceUrl">
            </div>
            <div id="nameHolder">
                {{user.name}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator"
    import {UserInDB} from "../../../scripts/db";

    @Component
    export default class extends Vue {
        @Prop({type: UserInDB}) user?:UserInDB|null;
    }
</script>

<style lang="scss">

    #userDetail{
        width: 80%;
        height: 80px;

        #top{
            width: 100%;
            height: 60px;
            display: flex;

        }
    }

</style>
