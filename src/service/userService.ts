import UserRepository from "../repository/userRepository";
import bcrypt from "bcrypt"
import User, {Role} from "../domain/User";
import {randomUUID} from "crypto";
import logger from "../logger/logger";
import {SALT_ROUND, SECRET_KEY} from "../config/constant";
import TokenService from "./tokenService";
import Token from "../domain/Token";
import jwt from "jsonwebtoken";

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
                        .then(() => {
                            logger.info({message: `Default username '${user.username}' and password '${password}'`});
                            const payload = JSON.stringify(new Token("INTERNAL_USER", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 100))));
                            const token = jwt.sign(payload, SECRET_KEY)
                            logger.info({message: `default INTERNAL TOKEN: ${token}`})
                        })

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