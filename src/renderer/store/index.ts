import Vue from 'vue'
import Vuex from 'vuex'

import {createPersistedState, createSharedMutations} from 'vuex-electron'

import {Config} from "../../common/config/config";
import {Templates} from "../../main/loadTemplate";
import {GiftInfo} from "../scripts/@type/giftInfo";
import {DanmakuWrapper, SendGiftWrapper} from "../scripts/DanmakuHandler";

Vue.use(Vuex)

const state = {
    config: new Config(),
    templates: new Templates(),
    gifts: new Map<number, GiftInfo>(),
    comboMap: new Map<string, number>(),
    popularNum: -1,
    dev: false,
    configPath: "../../../../config"
}

const mutations = {
    SET_CONFIG(state, config: Config) {
        state.config = config;
    },
    SET_TEMPLATES(state, templates: Templates) {
        state.templates = templates;
    },
    SET_GIFTS(state, gifts: Map<number, GiftInfo>) {
        state.gifts = gifts;
    },
    SET_POPULAR_NUM(state, popularNum) {
        state.popularNum = popularNum;
    },
    SET_COMBO_NUM(state, {comboId, num}) {
        state.comboMap[comboId] = num
    },
    SET_IF_DEV(state, dev) {
        state.dev = dev;
    },
    SET_CONFIG_PATH(state, configPath) {
        state.configPath = configPath;
    }
}

const getters = {
    hasComboId: (state) => (comboId) => {
        return state.comboMap.has(comboId)
    }
}

const actions = {
    setPopularNum({commit}, num) {
        commit("SET_POPULAR_NUM", num);
    },
    setComboNum({commit}, payload) {
        commit("SET_COMBO_NUM", payload)
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    plugins: [
        createPersistedState(),
        createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})
