export class OrCondition {
    operator: "EQ" | "NE" | "GT" | "LT" | "GE" | "LE"
    type: "DEVICE" | "VARIABLE"
    identifier: Record<string, any>
    condition: { key: string, value: any }

    constructor(orCondition: OrCondition) {
        this.operator = orCondition.operator
        this.type = orCondition.type
        this.identifier = orCondition.identifier
        this.condition = orCondition.condition
    }
}

class Condition {
    orConditions: Array<OrCondition>

    constructor(condition: Condition) {
        this.orConditions = condition.orConditions.map(arg => new OrCondition(arg))
    }
}

export default Condition