class Device {
    readonly _id: string | null
    readonly location: string
    readonly name: string
    readonly number: number
    readonly nodeMcu: string
    readonly pin: number
    readonly type: "ANALOG" | "DIGITAL"
    readonly mode: "INPUT" | "OUTPUT"
    readonly logic: "DIRECT" | "INDIRECT"
    readonly control: "ENABLED" | "DISABLED"
    readonly routine: string | null = null
    value: number

    constructor(device: Device) {
        this._id = device._id
        this.location = device.location
        this.name = device.name
        this.number = device.number
        this.nodeMcu = device.nodeMcu
        this.pin = device.pin
        this.type = device.type
        this.mode = device.mode
        this.logic = device.logic
        this.control = device.control
        this.value = device.value
        this.routine = device.routine
    }

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