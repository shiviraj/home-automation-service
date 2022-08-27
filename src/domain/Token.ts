const now = new Date()
const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7))

class Token {
    readonly username: string
    readonly createdAt: Date
    readonly expiredAt: Date

    constructor(username: string = "", createAt: Date = now, expiredAt: Date = nextWeek) {
        this.username = username
        this.createdAt = createAt
        this.expiredAt = expiredAt
    }
}

export default Token