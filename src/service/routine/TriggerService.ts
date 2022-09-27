import Trigger from "../../domain/routine/Trigger";
import VariableService from "../VariableService";

class TriggerService {
    private variableService: VariableService;

    constructor() {
        this.variableService = new VariableService()
    }

    async isTriggered(trigger: Trigger) {
        try {
            if (trigger.type === "VOICE") {
                return false
            }
            if (trigger.type === "SCHEDULED") {
                let time = trigger.at as string
                if (time === "SUN_SET" || time === "SUN_RISE") {
                    time = await this.variableService.getValueOf(time)
                        .then(variable => variable.value as string)
                }
                return new Date().toTimeString().startsWith(time)
            }
            return false;
        } catch (e) {
            return false
        }
    }

}

export default TriggerService