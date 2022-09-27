export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

class User {
    readonly _id?: string | null = null
    username: string
    name: string
    email: string
    password: string
    readonly role: Role

    constructor(user: User) {
        this.username = user.username
        this.name = user.name
        this.email = user.email
        this.password = user.password
        this.role = user.role
    }

    updatePassword(password: string): User {
        this.password = password
        return this
    }
}

export default User