import moment from "moment";

const IST_TIMEZONE = "+05:30"
const momentIst = (time: any = undefined): moment.Moment => moment(time).utcOffset(IST_TIMEZONE)

export {momentIst, moment}