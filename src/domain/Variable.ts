export type Document = Record<string, any>

class Variable<T extends any> {
    _id?: string | null = null
    label: string
    name: string
    value: T
    type: "string" | "number" | "boolean" | "Date"

    constructor(variable: Variable<T>) {
        this._id = variable._id
        this.label = variable.label
        this.name = variable.name
        this.value = variable.value
        this.type = variable.type
    }
}

export default Variable