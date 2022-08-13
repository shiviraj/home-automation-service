import express, {NextFunction, Request, Response} from "express";
import DeviceService from "../service/deviceService";
import logger, {ErrorLog} from "../logger/logger";
import {Collection} from "raspberrypi-db/lib/pi/collection";
import HAErrors from "../error/HAErrors";

const deviceController = express.Router()

deviceController.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.collection = res.locals.db.collection("devices")
    next()
})

deviceController.get("", (_req: Request, res: Response) => {
    DeviceService.getAllDevice(res.locals.collection as Collection)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8001 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8001)
        })
})


export default deviceController