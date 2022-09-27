import Condition from "../../domain/routine/Condition";

class ConditionService {

    constructor() {
    }

    async isSatisfied(conditions: Array<Condition>) {
        return conditions.every((andCondition) => {
            return andCondition.orConditions.some((_condition) => {
                // TODO: Need to implement conditions
                return false
            })
        })
    }
}

export default ConditionService