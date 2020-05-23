import { Component, Prop, Vue } from "vue-property-decorator";
import store from "../../../store";
import { SuperChatWrapper } from "../../../scripts/DanmakuHandler";

@Component({
    template: store.state.templates.innerSuperChatTemplate,
})
class InnerSuperChat extends Vue {
    @Prop({ type: SuperChatWrapper }) data;

    focusUser() {
        store.dispatch("SET_FOCUS_USER", { "userInDB": this.data.user });
    }
}

export default InnerSuperChat;
