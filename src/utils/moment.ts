import moment from "moment";

const IST_TIMEZONE = "Asia/Kolkata"
const momentIst = (time: any = undefined): moment.Moment => moment(time).utcOffset(IST_TIMEZONE)

export {momentIst, moment}