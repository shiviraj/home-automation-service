class Device {
    readonly _id: string | null = null
    readonly location: string = ""
    readonly name: string = ''
    readonly number: number = 0
    readonly nodeMcu: string = ""
    readonly pin: number = 0
    readonly type: string = ""
    readonly mode: string = ""
    value: number = 0

    updateValue(value: number): Device {
        this.value = value
        return this
    }
}

export default Device