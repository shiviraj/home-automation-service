import {CronJob} from "cron";

abstract class CronScheduler {
    startCron(cron: string) {
        new CronJob(cron, this.start.bind(this), null, true)
    }

    abstract start(): void ;
}

export default CronScheduler