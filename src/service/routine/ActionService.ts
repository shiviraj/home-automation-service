import Action from "../../domain/routine/Action";
import DeviceService from "../DeviceService";
import MQTTTopic from "../../domain/MQTTTopic";
import wss, {WSEvent} from "../../websocketServer";

class ActionService {
    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService()
    }

    executeActions(actions: Array<Action>) {
        actions.forEach(async (action, index) => {
            switch (action.type) {
                case "WAIT":
                    this.waitForRemainingTasks(actions, index, action);
                    break;
                case "VI":
                    break;
                case "DEVICE":
                    await this.updateDeviceState(action)
                    break;
                default:
                    break;
            }

        })
    }

    private waitForRemainingTasks(actions: Array<Action>, index: number, action: Action) {
        const remainingActions = actions.splice(index)
        actions.splice(0, actions.length)
        setTimeout(this.executeActions, action.update.value * 60000, remainingActions)
    }

    private updateDeviceState(action: Action) {
        return this.deviceService.updateState(action.identifier, action.update.value)
            .then((device) => {
                wss.broadcastAndSendToNode({event: WSEvent.UPDATE_STATE, data: device}, MQTTTopic.UPDATE_STATE)
            })
    }
}

export default ActionService