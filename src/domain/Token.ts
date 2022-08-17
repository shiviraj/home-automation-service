class Token {
    readonly username: string = ""
    readonly createdAt: Date = new Date()
    readonly expiredAt: Date = new Date(new Date().setDate(new Date().getDate() + 7))
}

export default Token