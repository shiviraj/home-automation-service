import RoutineService from "../service/routine/RoutineService";
import VariableService from "../service/VariableService";
import CronScheduler from "./CronScheduler";

class Scheduler extends CronScheduler {
    private readonly routineService: RoutineService;
    private variableService: VariableService;
    private SUN_SET: string = "18:06";
    private SUN_RISE: string = "05:55";

    constructor() {
        super();
        this.routineService = new RoutineService()
        this.variableService = new VariableService()
        this.init()
    }

    start() {
        const time = this.getTime()
        return this.routineService.executeScheduled(time)
    }

    private getTime(): string {
        const time = new Date().toTimeString().slice(0, 5);
        if (time === this.SUN_SET) return "SUN_SET"
        if (time === this.SUN_RISE) return "SUN_RISE"

        return time
    }

    private init() {
        this.variableService.getValueOf<string>("SUN_SET")
            .then(time => this.SUN_SET = time)
            .catch()
        this.variableService.getValueOf<string>("SUN_RISE")
            .then(time => this.SUN_RISE = time)
            .catch()
    }
}

export default Scheduler