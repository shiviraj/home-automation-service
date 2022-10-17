import Condition, {OrCondition} from "../../domain/routine/Condition";
import DeviceService from "../DeviceService";
import Sun from "../../utils/sun";

class ConditionService {
    private deviceService: DeviceService;
    private sun: Sun;

    constructor() {
        this.deviceService = new DeviceService()
        this.sun = new Sun()
    }

    async isSatisfied(conditions: Array<Condition>) {
        return conditions.every((andCondition) => {
            return andCondition.orConditions.some(async (condition) => {
                switch (condition.type) {
                    case "DEVICE":
                        return await this.executeDeviceCondition(condition)
                    case "TIME":
                        return this.isSatisfiedTime(condition)
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

    private executeCondition<T>(deviceElement: T, operator: "EQ" | "NE" | "GT" | "LT" | "GE" | "LE", value: T) {
        switch (operator) {
            case "EQ":
                return deviceElement === value
            case "NE":
                return deviceElement !== value
            case "GT":
                return deviceElement > value
            case "LT":
                return deviceElement < value
            case "GE":
                return deviceElement >= value
            case "LE":
                return deviceElement <= value
            default:
                return true
        }
    }

    private isSatisfiedTime(condition: OrCondition): boolean {
        switch (condition.identifier.operator) {
            case "BETWEEN":
                return this.sun.isBetween(condition.condition)
            default:
                return true
        }
    }
}

export default ConditionService