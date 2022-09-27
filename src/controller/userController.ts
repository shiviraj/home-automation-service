import express, {NextFunction, Request, Response} from "express";
import logger, {ErrorLog} from "../logger/logger";
import HAErrors from "../error/HAErrors";
import UserService from "../service/UserService";
import User, {Role} from "../domain/User";

const userController = express.Router()
const userService = new UserService()

userController.post("/login", (req: Request, res: Response) => {
    userService.login(req.body.username, req.body.password)
        .then((data) => res.send({token: data}))
        .catch((err) => {
            logger.error({...HAErrors.HA8003 as ErrorLog, details: err})
            res.status(401).send(HAErrors.HA8003)
        })
})

userController.get("/validate", (_req: Request, res: Response) => {
    res.send(res.locals.user as User)
})

userController.put("/update-password", (req: Request, res: Response) => {
    userService.updatePassword(req.body, res.locals.user as User)
        .then(data => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8011, details: err})
            res.status(500).send(HAErrors.HA8011)
        })
})

userController.put("", (req: Request, res: Response) => {
    userService.updateProfile(req.body, res.locals.user as User)
        .then(data => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8012, details: err})
            res.status(500).send(HAErrors.HA8012)
        })
})

userController.use((_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.role !== Role.ADMIN) {
        res.status(422).send(HAErrors.HA8007)
        return
    }
    next()
})

userController.get("", (_req: Request, res: Response) => {
    userService.getAllUsers()
        .then(data => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8010, details: err})
            res.status(500).send(HAErrors.HA8010)
        })
})

userController.post("", (req: Request, res: Response) => {
    userService.addUser(req.body)
        .then(data => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8009, details: err})
            res.status(500).send(HAErrors.HA8009)
        })
})

userController.post("/username-available", (req: Request, res: Response) => {
    userService.isUsernameAvailable(req.body)
        .then(data => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8008, details: err})
            res.status(500).send(HAErrors.HA8008)
        })
})

export default userController