import {moment, momentIst} from "../utils/moment";

const now = momentIst()
const nextWeek = momentIst().add({days: 7})

class Token {
    readonly username: string
    readonly createdAt: moment.Moment
    readonly expiredAt: moment.Moment

    constructor(username: string = "", createAt: moment.Moment = now, expiredAt: moment.Moment = nextWeek) {
        this.username = username
        this.createdAt = createAt
        this.expiredAt = expiredAt
    }
}

export default Token