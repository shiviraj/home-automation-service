import VariableRepository from "../repository/VariableRepository";
import Variable from "../domain/Variable";
import logger from "../logger/logger";

class VariableService {
    private variableRepository: VariableRepository;

    constructor() {
        this.variableRepository = new VariableRepository()
    }

    async getValueOf<T>(variableName: string): Promise<T> {
        return this.variableRepository.findOne({name: variableName})
            .then((variable: Variable<T>) => variable.value)
    }

    updateVariable(identifier: Record<string, any>, update: Record<string, any>) {
        return this.variableRepository.findOne(identifier)
            .then((variable) => {
                try {
                    variable.value = eval(update.value)
                } catch (e) {
                    variable.value = update.value
                    logger.error({errorCode: "", errorMessage: "Failed to update variable"})
                }
                return this.variableRepository.save(variable)
            })
    }
}

export default VariableService