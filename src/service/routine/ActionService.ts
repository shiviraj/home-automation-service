import Action from "../../domain/routine/Action";
import DeviceService from "../DeviceService";

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

    private async updateDeviceState(action: Action) {
        return await this.deviceService.updateState(action.identifier, action.update.value)
    }
}

export default ActionService