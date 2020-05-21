import { Component, Prop, Vue } from "vue-property-decorator";
import store from "../../../store";
import { SuperChatWrapper } from "../../../scripts/DanmakuHandler";
import CircleProcess from "./CircleProcess.vue";

@Component({
    template: store.state.templates.superChatQueueItemTemplate,
    components:{CircleProcess}
})
class SuperChatQueueItem extends Vue {
    @Prop({ type: SuperChatWrapper }) superChatData;

    mounted(): void {
        // @ts-ignore
        this.$emit("set-holder-scoll",this.$el.offsetLeft - 20);
    }
}

export { SuperChatQueueItem };
