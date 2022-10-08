import Repository from "./Repository";
import Variable from "../domain/Variable";

const collectionName = "variables"

class VariableRepository extends Repository<Variable<any>> {
    constructor() {
        super(collectionName, Variable);
    }

    findOne(param: Record<string, any>) {
        return super.findOne(param)
            .then((variable) => {
                switch (variable.type) {
                    case "string":
                        return variable as Variable<string>
                    case "number":
                        return variable as Variable<number>
                    case "Date":
                        return variable as Variable<Date>
                    default:
                        return variable
                }
            })
    }

}

export default VariableRepository