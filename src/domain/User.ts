export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

class User {
    readonly _id: string | null = null
    username: string
    name: string
    email: string
    password: string
    readonly role: Role

    constructor(username: string = "", name: string = "", email: string = "", password: string = "", role: Role = Role.USER) {
        this.username = username
        this.name = name
        this.email = email
        this.password = password
        this.role = role
    }

    updatePassword(password: string): User {
        this.password = password
        return this
    }
}

export default User