import RoutineService from "../service/routine/RoutineService";
import CronScheduler from "./CronScheduler";
import logger from "../logger/logger";
import {momentIst} from "../utils/moment";
import Sun from "../utils/sun";

class Scheduler extends CronScheduler {
    private readonly routineService: RoutineService;
    private sun: Sun;

    constructor() {
        super();
        this.routineService = new RoutineService()
        this.sun = new Sun()
    }

    start() {
        const now = momentIst()
        logger.info({message: "Scheduler started...", data: {startedAt: now.format("YYYY-MM-DD HH:mm:ss Z")}})
        const time = now.format("HH:mm");
        this.routineService.executeScheduled(time)
            .catch((_error) => ({}))
            .then(() => {
                if (this.sun.isSunSet() || this.sun.isSunRise()) {
                    const timeAsSun = this.sun.timeAsSun()
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
}

export default Scheduler
