export type Log = { message: string, data?: any }
export type ErrorLog = { errorCode: string, errorMessage: string, data?: any, details?: any }

const getFormat = (num: number, length: number = 2): string => String(num).padStart(length, '0')

const getTimezone = (offset: number) => {
    const t1 = Math.abs(offset / 60)
    const hrs = Math.floor(t1)
    const mins = (t1 - hrs) * 60
    const offsetSymbol = offset < 0 ? '+' : '-'
    return `${offsetSymbol}${getFormat(hrs)}${getFormat(mins)}`
}

const getTimestamp = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    const time = `${[getFormat(now.getHours()),
        getFormat(now.getMinutes()),
        getFormat(now.getSeconds())].join(':')}.${getFormat(now.getMilliseconds(), 3)}`
    const timezone = getTimezone(now.getTimezoneOffset())
    return `${year}-${getFormat(month)}-${getFormat(date)}T${time}${timezone}`
}

const logger = {
    info(log: Log) {
        console.log(JSON.stringify({
            timestamp: getTimestamp(),
            level: "INFO",
            details: log
        }))
    },
    error(log: ErrorLog) {
        console.log(JSON.stringify({
            timestamp: getTimestamp(),
            level: "ERROR",
            ...log
        }))
    }
}

export default logger