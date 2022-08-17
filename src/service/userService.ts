import UserRepository from "../repository/userRepository";
import bcrypt from "bcrypt"
import User, {Role} from "../domain/User";
import {randomUUID} from "crypto";
import logger from "../logger/logger";
import {SALT_ROUND} from "../config/constant";
import TokenService from "./tokenService";

const userRepository = new UserRepository()

const UserService = {
    initUser() {
        userRepository.find({})
            .then(async (users: Array<User>) => {
                if (users.length === 0) {
                    const password = randomUUID()
                    const user = Object.assign(new User(), {
                        username: "admin",
                        name: "Admin",
                        password: await bcrypt.hash(password, SALT_ROUND),
                        role: Role.ADMIN
                    })
                    userRepository.save(user)
                        .then(() => logger.info({message: `Default username '${user.username}' and password '${password}'`}))
                }
            })
    },

    login(username: string, password: string): Promise<string> {
        return userRepository.findOne({username})
            .then(async (user: User) => {
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    return TokenService.create(user)
                } else {
                    return Promise.reject<string>()
                }
            })
    },

    findUserBy(username: string): Promise<User> {
        return userRepository.findOne({username})
    }
}

export default UserService