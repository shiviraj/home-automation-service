import logger from "../logger/logger";
import SunCalc from "suncalc";
import {moment, momentIst, TIME_FORMAT} from "./moment";
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

    private async init() {
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
        return this.sunSet.format(TIME_FORMAT)
    }

    getSunRiseTime(): string {
        return this.sunRise.format(TIME_FORMAT)
    }

    isSunSet(): boolean {
        return momentIst().format(TIME_FORMAT) === this.getSunSetTime();
    }

    isSunRise(): boolean {
        return momentIst().format(TIME_FORMAT) === this.getSunRiseTime();
    }

    timeAsSun(): string {
        return this.isSunSet() ? 'SUN_SET' : "SUN_RISE"
    }

    isBetween(start: string, end: string): boolean {
        const startTime = this.getTime(start)
        const endTime = this.getTime(end)
        return momentIst().isBetween(startTime, endTime)
    }

    private getTime(time: string): moment.Moment {
        if (time === "SUN_SET") time = this.getSunSetTime()
        if (time === "SUN_RISE") time = this.getSunRiseTime()
        return momentIst(time, TIME_FORMAT)
    }
}

export default Sun