import Trigger from "./Trigger";
import Condition from "./Condition";
import Action from "./Action";

class Routine {
    _id: string | null
    name: string
    state: "active" | "inactive"
    trigger: Trigger
    conditions: Array<Condition>
    actions: Array<Action>

    constructor(routine: Routine) {
        this._id = routine._id
        this.name = routine.name
        this.state = routine.state
        this.trigger = new Trigger(routine.trigger)
        this.conditions = routine.conditions.map(condition => new Condition(condition))
        this.actions = routine.actions.map(action => new Action(action))
    }

    isConditionSatisfied() {
        return false;
    }

    executeActions() {

    }
}

export default Routine