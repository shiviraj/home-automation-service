import RoutineService from "../service/routine/RoutineService";
import CronScheduler from "./CronScheduler";
import SunCalc from "suncalc"
import VariableService from "../service/VariableService";
import logger from "../logger/logger";

class Scheduler extends CronScheduler {
    private readonly routineService: RoutineService;
    private variableService: VariableService;
    private SUN_SET: string = "18:06";
    private SUN_RISE: string = "05:55";

    constructor() {
        super();
        this.routineService = new RoutineService()
        this.variableService = new VariableService()
        this.init().then()
    }

    start() {
        const time = new Date().toTimeString().slice(0, 5);
        if (time === this.SUN_SET || time === this.SUN_RISE) {
            const timeAsSun = time === this.SUN_SET ? "SUN_SET" : "SUN_RISE"
            this.routineService.executeScheduled(timeAsSun)
                .catch((error) => logger.error({
                    errorCode: "",
                    errorMessage: "Failed to execute scheduler",
                    details: error
                }))
        }
        return this.routineService.executeScheduled(time)
            .catch((error) => logger.error({
                errorCode: "",
                errorMessage: `Failed to execute scheduler at ${time}`,
                details: error
            }))
    }

    private async init() {
        let longitude = 0
        let latitude = 0
        try {
            longitude = await this.variableService.getValueOf<number>("LONGITUDE")
            latitude = await this.variableService.getValueOf<number>("LATITUDE")
        } catch (err) {
            longitude = 77.2090
            latitude = 28.6139
        } finally {
            const {sunrise, sunset} = SunCalc.getTimes(new Date(), latitude, longitude)
            this.SUN_SET = sunset.toTimeString().slice(0, 5)
            this.SUN_RISE = sunrise.toTimeString().slice(0, 5)
            setTimeout(this.init.bind(this), 6 * 60 * 60 * 1000)
        }
    }
}

export default Scheduler