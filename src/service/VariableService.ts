import VariableRepository from "../repository/VariableRepository";
import Variable from "../domain/Variable";

class VariableService {
    private variableRepository: VariableRepository;

    constructor() {
        this.variableRepository = new VariableRepository()
    }

    async getValueOf<T>(variableName: string): Promise<T> {
        return this.variableRepository.findOne({name: variableName})
            .then((variable: Variable<T>) => variable.value)
    }
}

export default VariableService