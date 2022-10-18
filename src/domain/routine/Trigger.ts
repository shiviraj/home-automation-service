import {momentIst, TIME_FORMAT} from "../../utils/moment";

class Trigger {
    type: "VOICE" | "SCHEDULED" | "SENSOR"
    at: Array<string>

    constructor(trigger: Trigger) {
        this.type = trigger.type
        this.at = trigger.at
    }

    update(update: { type: string, value: string }) {
        if (update.type === "TIME") {
            this.at = [momentIst().add(update.value, 'm').format(TIME_FORMAT)]
        }
    }
}

export default Trigger