export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

class User {
    readonly _id: string | null = null
    readonly username: string = ""
    readonly name: string = ""
    readonly password: string = ""
    readonly role: Role = Role.USER
}

export default User