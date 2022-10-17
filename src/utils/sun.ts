import logger from "../logger/logger";
import SunCalc from "suncalc";
import {moment, momentIst} from "./moment";
import VariableService from "../service/VariableService";

class Sun {
    private longitude: number = 77.2090
    private latitude: number = 28.6139
    private variableService: VariableService;
    private sunSet: moment.Moment;
    private sunRise: moment.Moment;

    constructor() {
        this.variableService = new VariableService()
        this.sunRise = momentIst()
        this.sunSet = momentIst()
        this.init().then()
    }

    async init() {
        try {
            this.longitude = await this.variableService.getValueOf<number>("LONGITUDE")
            this.latitude = await this.variableService.getValueOf<number>("LATITUDE")
        } catch (err) {
            logger.error({errorCode: "", errorMessage: "Failed to find coordinates", details: err})
        } finally {
            const {sunrise, sunset} = SunCalc.getTimes(momentIst().toDate(), this.latitude, this.longitude)
            this.sunSet = momentIst(sunset)
            this.sunRise = momentIst(sunrise)
            setTimeout(this.init.bind(this), 6 * 60 * 60 * 1000)
        }
    }

    getSunSetTime(): string {
        return this.sunSet.format("HH:mm")
    }

    getSunRiseTime(): string {
        return this.sunRise.format("HH:mm")
    }

    isSunSet(): boolean {
        return momentIst().format("HH:mm") === this.getSunSetTime();
    }

    isSunRise(): boolean {
        return momentIst().format("HH:mm") === this.getSunRiseTime();
    }

    timeAsSun(): string {
        return this.isSunSet() ? 'SUN_SET' : "SUN_RISE"
    }

    isBetween(condition: Record<string, any>): boolean {
        const startTime = this.getTime(condition.start as string)
        const endTime = this.getTime(condition.end as string)
        return momentIst().isBetween(startTime, endTime)
    }

    private getTime(time: string) {
        if (time !== "SUN_SET" && time !== "SUN_RISE") {
            return momentIst(time)
        }
        return momentIst(time === "SUN_SET" ? this.getSunSetTime() : this.getSunRiseTime())
    }
}

export default Sun