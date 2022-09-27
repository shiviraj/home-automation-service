import UserRepository from "../repository/UserRepository";
import bcrypt from "bcryptjs"
import User, {Role} from "../domain/User";
import {randomUUID} from "crypto";
import logger from "../logger/logger";
import {SALT_ROUND, SECRET_KEY} from "../config/constant";
import TokenService from "./tokenService";
import Token from "../domain/Token";
import jwt from "jsonwebtoken";
import HAErrors from "../error/HAErrors";

class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.initUser()
    }

    addUser(user: User): Promise<User> {
        return this.isUsernameAvailable(user)
            .then(({status}) => {
                if (status) {
                    return this.addNewUser(user)
                }
                return Promise.reject(HAErrors.HA8009)
            })
    }

    login(username: string, password: string): Promise<string> {
        return this.userRepository.findOne({username})
            .then(async (user: User | null) => {
                if (user === null) {
                    return Promise.reject<string>()
                }
                const match = await bcrypt.compare(password, user.password)
                if (match) {
                    return TokenService.create(user)
                }
                return Promise.reject<string>()
            })
    }

    findUserBy(username: string) {
        return this.userRepository.findOne({username})
    }

    getAllUsers(): Promise<Array<User>> {
        return this.userRepository.find({})
    }

    isUsernameAvailable({username}: { username: string }): Promise<{ status: boolean }> {
        return this.userRepository.exists({username})
            .then((status: boolean) => ({status: !status}))
    }

    private initUser() {
        this.userRepository.exists({})
            .then(async (isExist) => {
                if (!isExist) {
                    const password = randomUUID()
                    this.addUser({
                        username: "admin",
                        name: "Admin",
                        email: "admin@mail.com",
                        password,
                        role: Role.ADMIN
                    } as User)
                        .then((user: User) => {
                            logger.info({message: `Default username '${user.username}' and password '${password}'`});
                            const payload = JSON.stringify(new Token("INTERNAL_USER", new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 100))));
                            const token = jwt.sign(payload, SECRET_KEY)
                            logger.info({message: `default INTERNAL TOKEN: ${token}`})
                        })

                }
            })
    }

    private async addNewUser(userDetails: User): Promise<User> {
        const password = await bcrypt.hash(userDetails.password, SALT_ROUND)
        const user = new User(Object.assign(userDetails, {password}))
        return this.userRepository.save(user)
    }

    async updatePassword({oldPassword, password}: { oldPassword: string, password: string }, user: User) {
        const match = await bcrypt.compare(oldPassword, user.password)
        if (match) {
            user.password = await bcrypt.hash(password, SALT_ROUND)
            return this.userRepository.save(user)
                .then(() => ({error: false, message: "Successfully updated password!"}))
        }
        return Promise.reject({error: true, message: "Invalid password"})
    }

    async isNewUsernameNotAvailable(profile: { username: string; email: string; name: string }, user: User) {
        return profile.username !== user.username && !(await this.isUsernameAvailable({username: profile.username})).status;
    }

    async updateProfile(profile: { username: string, email: string, name: string }, user: User) {
        if (await this.isNewUsernameNotAvailable(profile, user)) {
            return Promise.reject({error: true, message: "Username is not available!"})
        }
        user.username = profile.username
        user.name = profile.name
        user.email = profile.email
        return this.userRepository.save(user)
            .then(() => ({error: false, message: "Successfully updated user profile"}))
    }
}

export default UserService