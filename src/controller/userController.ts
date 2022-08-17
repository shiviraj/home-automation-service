import express, {NextFunction, Request, Response} from "express";
import logger, {ErrorLog} from "../logger/logger";
import HAErrors from "../error/HAErrors";
import UserService from "../service/userService";
import TokenService from "../service/tokenService";
import User from "../domain/User";

const userController = express.Router()

userController.post("/login", (req: Request, res: Response) => {
    UserService.login(req.body.username, req.body.password)
        .then((data) => res.send({token: data}))
        .catch((err) => {
            logger.error({...HAErrors.HA8003 as ErrorLog, details: err})
            res.status(401).send(HAErrors.HA8003)
        })
})

userController.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: [boolean, string] = TokenService.validate(req.headers.authorization || "")
        if (!token[0]) {
            logger.error({...HAErrors.HA8004 as ErrorLog})
            res.status(401).send(HAErrors.HA8004)
            return
        }
        res.locals.user = await UserService.findUserBy(token[1])
        next()
    } catch (e) {
        logger.error({...HAErrors.HA8004 as ErrorLog})
        res.status(401).send(HAErrors.HA8004)
    }
})

userController.get("", (_req: Request, res: Response) => {
    res.send(res.locals.user as User)
})

export default userController