import jwt from 'jsonwebtoken'
import Token from "../domain/Token";
import {SECRET_KEY} from "../config/constant";
import User from "../domain/User";


const TokenService = {

    create(user: User) {
        const payload = JSON.stringify(Object.assign(new Token(), {username: user.username}));
        return jwt.sign(payload, SECRET_KEY)
    },

    validate(token: string): [boolean, string] {
        const payload = jwt.verify(token, SECRET_KEY)

        if (typeof payload === "string") return [false, ""]

        if (new Date(payload.createdAt) < new Date() && new Date() < new Date(payload.expiredAt)) {
            return [true, payload.username as string];
        }
        return [false, ""]
    }
}

export default TokenService