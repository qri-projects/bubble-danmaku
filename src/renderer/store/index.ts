import Vue from "vue"
import Vuex, {ActionTree} from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'

import {Config} from "../../common/config/config";
import {TemplatesText} from "../../main/loadTemplate";
import {GiftInfo} from "../scripts/@type/giftInfo";
import {DanmakuHandler, DanmakuWrapper, SendGiftWrapper} from "../scripts/DanmakuHandler";
import {UserInDB} from "../scripts/db";

Vue.use(Vuex)

const state = {
    config: new Config(),
    templates: new TemplatesText(),
    gifts: new Map<number, GiftInfo>(),
    dev: false,
    configPath: "../../../../config",
    focusUser:null,
    usersCache:new Map<Number, UserInDB>()
}

const mutations = {
    SET_CONFIG(state, config: Config) {
        state.config = config;
    },
    SET_TEMPLATES(state, templates: TemplatesText) {
        state.templates = templates;
    },
    SET_GIFTS(state, gifts: Map<number, GiftInfo>) {
        state.gifts = gifts;
    },
    SET_IF_DEV(state, dev) {
        state.dev = dev;
    },
    SET_CONFIG_PATH(state, configPath) {
        state.configPath = configPath;
    },
    SET_FOCUS_USER(state, focusUser){
        state.focusUser = focusUser;
        console.log("mutations")
    },
    SET_FOCUSED_USER_NICKNAME(state, nickName){
        state.focusUser.nickName = nickName;
    },
    SET_USER_IN_CACHE(state, user:UserInDB){
        state.usersCache[user.id] = user
    }
}

const getters = {
    getUser: (state) => (userId) => {
        return state.usersCache[userId]
    }
}

const actions = {
    SET_FOCUS_USER({commit},{userInDB}){
        commit("SET_FOCUS_USER", userInDB)
    },
    SET_FOCUSED_USER_NICKNAME({commit}, {nickName}){
        commit("SET_FOCUSED_USER_NICKNAME", nickName);
    },
    SET_USER_IN_CACHE({commit}, {user}){
        commit("SET_USER_IN_CACHE", user);
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [
        // createPersistedState(),
        createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})
