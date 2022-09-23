class Device {
    readonly _id: string | null = null
    readonly location: string = ""
    readonly name: string = ''
    readonly number: number = 0
    readonly nodeMcu: string = ""
    readonly pin: number = 0
    readonly type: "ANALOG" | "DIGITAL" = "ANALOG"
    readonly mode: "INPUT" | "OUTPUT" = "INPUT"
    readonly logic: "DIRECT" | "INDIRECT" = "DIRECT"
    readonly control: "ENABLED" | "DISABLED" = "DISABLED"
    value: number = 0

    updateInputValue(value: number): Device {
        this.value = value
        return this
    }

    updateState(value: number): Device {
        if (this.mode === "OUTPUT" && this.control === "ENABLED")
            this.value = value
        return this
    }
}

export default Device