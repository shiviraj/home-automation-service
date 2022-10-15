import RoutineService from "../service/routine/RoutineService";
import CronScheduler from "./CronScheduler";
import SunCalc from "suncalc"
import VariableService from "../service/VariableService";
import logger from "../logger/logger";
import {momentIst} from "../utils/moment";

class Scheduler extends CronScheduler {
    private readonly routineService: RoutineService;
    private variableService: VariableService;
    private SUN_SET: string = "18:06";
    private SUN_RISE: string = "05:55";
    private longitude: number = 77.2090
    private latitude: number = 28.6139

    constructor() {
        super();
        this.routineService = new RoutineService()
        this.variableService = new VariableService()
        this.init().then()
    }

    start() {
        const now = momentIst()
        logger.info({message: "Scheduler started...", data: {startedAt: now.format("YYYY-MM-DD HH:mm:ss Z")}})
        const time = now.format("HH:mm");
        this.routineService.executeScheduled(time)
            .catch((_error) => ({}))
            .then(() => {
                if (time === this.SUN_SET || time === this.SUN_RISE) {
                    const timeAsSun = time === this.SUN_SET ? "SUN_SET" : "SUN_RISE"
                    return this.routineService.executeScheduled(timeAsSun)
                }
                return new Promise((resolve) => resolve(""))
            })
            .then(logger.logOnSuccess({
                    message: "Scheduler completed",
                    data: {
                        startedAt: now.format("YYYY-MM-DD HH:mm:ss Z"),
                        completedAt: momentIst().format("YYYY-MM-DD HH:mm:ss Z")
                    }
                })
            )
            .catch(logger.logOnError({
                errorCode: "",
                errorMessage: "Failed Scheduler",
                data: {
                    startedAt: now.format("YYYY-MM-DD HH:mm:ss Z"),
                    failedAt: momentIst().format("YYYY-MM-DD HH:mm:ss Z")
                }
            }))
    }

    private async init() {
        try {
            this.longitude = await this.variableService.getValueOf<number>("LONGITUDE")
            this.latitude = await this.variableService.getValueOf<number>("LATITUDE")
        } catch (err) {
            logger.error({errorCode: "", errorMessage: "Failed to find coordinates", details: err})
        } finally {
            const {sunrise, sunset} = SunCalc.getTimes(momentIst().toDate(), this.latitude, this.longitude)
            this.SUN_SET = momentIst(sunset).format("HH:mm")
            this.SUN_RISE = momentIst(sunrise).format("HH:mm")
            setTimeout(this.init.bind(this), 6 * 60 * 60 * 1000)
        }
    }
}

export default Scheduler
