import Condition, {OrCondition} from "../../domain/routine/Condition";
import DeviceService from "../DeviceService";

class ConditionService {
    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService()
    }

    async isSatisfied(conditions: Array<Condition>) {
        return conditions.every((andCondition) => {
            return andCondition.orConditions.some(async (condition) => {
                switch (condition.type) {
                    case "DEVICE":
                        return await this.executeDeviceCondition(condition)
                    default:
                        return true
                }
            })
        })
    }

    private async executeDeviceCondition(condition: OrCondition) {
        const device = await this.deviceService.findDevice(condition.identifier)
        return this.executeCondition<number>(device.getValue(condition.condition.key), condition.operator, condition.condition.value)
    }

    private executeCondition<T>(deviceElement: any, operator: "EQ" | "NE" | "GT" | "LT" | "GE" | "LE", value: any) {
        switch (operator) {
            case "EQ":
                return deviceElement as T === value as T
            default:
                return true
        }

    }
}

export default ConditionService