<template>
    <div id="userDetailHolder" v-if="!!user">
        <div id="userDetail">
            <div id="topBg" :style="`background-image:url('${user.topPhotoFileName}')`"></div>
            <outer-link :href="`https://space.bilibili.com/${user.id}`">
                <div id="headImgHolder">
                    <img :src="user.faceUrl" />
                </div>
            </outer-link>
            <div id="basicInfo">
                <div id="basicInfoUid">Uid: {{ user.id }}</div>
                <div id="basicInfoName">用户名: {{ user.name }}</div>
            </div>
            <div id="nameHolder">
                <span v-show="!editingNickName" @click="editNickName">{{ user.nickName ? user.nickName : user.name }}</span>
                <input tabindex="0" ref="nickNameInput" v-show="editingNickName" v-model="nickName" @blur="editNickNameBlur" />
            </div>
            <div id="badgesHolder">
                <div class="badge guardBadge" v-if="user.guardLevel > 0">
                    <img :src="`./config/src/image/guard${user.guardLevel}.png`" />
                </div>
                <outer-link v-if="user.medal && user.medal.medalLevel" :href="`https://live.bilibili.com/${user.medal.roomId}`">
                    <div
                        :class="`badge userMedalBadge userMedal medalLevel-${user.medal.medalLevel}`"
                        :title="`主播: ${user.medal.liverName}`"
                    >
                        <span class="medalName">{{ user.medal.medalName }}</span>
                        <span class="medalLevel">{{ user.medal.medalLevel }}</span>
                    </div>
                </outer-link>
                <div :class="`ul ul-${user.userLevel}`" style="display: block">UL {{ user.userLevel }}</div>
            </div>
            <div id="descriptionHolder">
                <div class="quote">「</div>
                <div id="description" :title="user.description">{{ user.description }}</div>
                <div class="quote">」</div>
            </div>
            <div @click="refreshUser">SHUAXIN</div>
        </div>
        <div id="userDetailMask" @click="closeUserDetail"></div>

    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { UserInDB } from "../../../scripts/db";
    import store from "../../../store";
    import {refreshUserInfo} from "../../../scripts/util/getUserInfoUtil";

    @Component
    export default class extends Vue {
        editingNickName: boolean = false;
        nickName:String = "";
        get user(){
            return this.$store.state.focusUser?this.$store.getters.getUser(this.$store.state.focusUser.id):null;
        }

        closeUserDetail() {
            if (this.editingNickName) {
                this.editNickNameBlur();
            }
            this.$store.dispatch("SET_FOCUS_USER", { "userInDB": null });
        }

        editNickName(){
            this.editingNickName = true;
            if (this.user != null) {
                this.nickName = this.user.nickName?this.user.nickName:this.user.name;
            }
        }

        setUserNickName(user:UserInDB, nickName:String){
            this.$store.dispatch("SET_FOCUSED_USER_NICKNAME", {nickName})
            window.db.updateUserAsync(user);
            let newUser:UserInDB = {...user, "nickName":nickName}
            this.$store.dispatch("SET_USER_IN_CACHE", {"user":newUser});
        }

        editNickNameBlur(){
            this.editingNickName = false;
            if(this.user) {
                if (this.nickName && this.nickName != this.user.nickName) {
                    this.setUserNickName(this.user, this.nickName);
                }
            }
        }

        refreshUser(){
            refreshUserInfo(this.user);
        }
    }
</script>
