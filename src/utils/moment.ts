import moment from "moment";

const IST_TIMEZONE = "+05:30"
const TIME_FORMAT = "HH:mm"

const momentIst = (time: any | undefined = undefined, format: string = ""): moment.Moment => {
    if (time && format) {
        time = time + IST_TIMEZONE
        format = format + 'Z'
    }
    return moment(time, format).utcOffset(IST_TIMEZONE);
}

export {momentIst, moment, TIME_FORMAT}