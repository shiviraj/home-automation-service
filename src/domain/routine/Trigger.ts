class Trigger {
    type: "VOICE" | "SCHEDULED" | "SENSOR"
    at: Array<string>

    constructor(trigger: Trigger) {
        this.type = trigger.type
        this.at = trigger.at
    }
}

export default Trigger