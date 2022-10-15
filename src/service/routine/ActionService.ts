import Action from "../../domain/routine/Action";
import DeviceService from "../DeviceService";
import MQTTTopic from "../../domain/MQTTTopic";
import wss, {WSEvent} from "../../websocketServer";
import VariableService from "../VariableService";

class ActionService {
    private deviceService: DeviceService;
    private variableService: VariableService;

    constructor() {
        this.deviceService = new DeviceService()
        this.variableService = new VariableService()
    }

    executeActions(actions: Array<Action>) {
        actions.forEach(this.executeAction.bind(this))
    }

    updateDeviceState(action: Action) {
        return this.deviceService.updateState(action.identifier, action.update.value)
            .then((device) => {
                wss.broadcastAndSendToNode({event: WSEvent.UPDATE_STATE, data: device}, MQTTTopic.UPDATE_STATE)
            })
    }

    private async executeAction(action: Action) {
        switch (action.type) {
            case "VI":
                break;
            case "DEVICE":
                await this.updateDeviceState(action)
                break;
            case "VARIABLE":
                await this.updateVariable(action)
                break;
            default:
                break;
        }
    }

    private async updateVariable(action: Action) {
        return this.variableService.updateVariable(action.identifier, action.update)
    }
}

export default ActionService