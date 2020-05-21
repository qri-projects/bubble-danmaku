import {Component, Prop, Vue} from "vue-property-decorator";
import store from "../../../store/index";
import {SuperChatWrapper} from "../../../scripts/DanmakuHandler";
import CircleProcess from "./CircleProcess.vue";
@Component({
    template: store.state.templates.superChatTemplate
})
class SuperChat extends Vue {
    @Prop({type: SuperChatWrapper}) superChatData;
}


export {SuperChat};
