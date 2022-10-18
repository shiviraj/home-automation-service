import RoutineService from "../service/routine/RoutineService";
import CronScheduler from "./CronScheduler";
import logger from "../logger/logger";
import {momentIst, TIME_FORMAT} from "../utils/moment";
import Sun from "../utils/sun";

class Scheduler extends CronScheduler {
    private readonly routineService: RoutineService;
    private readonly sun: Sun;

    constructor() {
        super();
        this.routineService = new RoutineService()
        this.sun = new Sun()
    }

    start() {
        const now = momentIst()
        logger.info({message: "Scheduler started..."})
        this.routineService.executeScheduled(now.format(TIME_FORMAT))
            .catch((_error) => ({}))
            .then(() => {
                if (this.sun.isSunSet() || this.sun.isSunRise()) {
                    return this.routineService.executeScheduled(this.sun.timeAsSun())
                }
                return new Promise((resolve) => resolve(""))
            })
            .then(logger.logOnSuccess({
                    message: "Scheduler completed",
                    data: {startedAt: now.format("YYYY-MM-DD HH:mm:ss Z")}
                })
            )
            .catch(logger.logOnError({
                errorCode: "",
                errorMessage: "Failed Scheduler",
                data: {startedAt: now.format("YYYY-MM-DD HH:mm:ss Z")}
            }))
    }
}

export default Scheduler
