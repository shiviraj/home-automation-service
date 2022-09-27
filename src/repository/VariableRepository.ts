import Repository from "./Repository";
import Variable from "../domain/Variable";

const collectionName = "variables"

class VariableRepository extends Repository<Variable<any>> {
    constructor() {
        super(collectionName, Variable);
    }
}

export default VariableRepository