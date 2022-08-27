export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

class User {
    readonly _id: string | null = null
    readonly username: string
    readonly name: string
    readonly password: string
    readonly role: Role

    constructor(username: string = "", name: string = "", password: string = "", role: Role = Role.USER) {
        this.username = username
        this.name = name
        this.password = password
        this.role = role
    }
}

export default User