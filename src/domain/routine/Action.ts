class Action {
    type: "DEVICE" | "WAIT" | "VI" | "VARIABLE" | "ROUTINE_TRIGGER_UPDATE"
    identifier: Record<string, any>
    update: Record<string, any>

    constructor(action: Action) {
        this.type = action.type
        this.identifier = action.identifier
        this.update = action.update
    }
}

export default Action