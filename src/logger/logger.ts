import {momentIst} from "../utils/moment";

export type Log = { message: string, data?: any }
export type ErrorLog = { errorCode: string, errorMessage: string, data?: any, details?: any, stack?: any }

const logger = {
    info(log: Log) {
        console.log(JSON.stringify({
            timestamp: momentIst().format("YYYY-MM-DD HH:mm:ss Z"),
            level: "INFO",
            details: log
        }))
    },
    error(log: ErrorLog) {
        console.log(JSON.stringify({
            timestamp: momentIst().format("YYYY-MM-DD HH:mm:ss Z"),
            level: "ERROR",
            ...log
        }))
    },
    logOnSuccess(log: Log) {
        return (arg: any) => {
            this.info(log)
            return arg
        };
    },
    logOnError(errorLog: ErrorLog) {
        return (error: any) => {
            this.error({...errorLog, stack: error.stack})
            throw error;
        };
    }
}

export default logger