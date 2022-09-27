import express, {Request, Response} from "express";
import DeviceService from "../service/DeviceService";
import logger, {ErrorLog} from "../logger/logger";
import HAErrors from "../error/HAErrors";
import RoutineService from "../service/routine/RoutineService";

const deviceController = express.Router()
const deviceService = new DeviceService()
const routineService = new RoutineService()

deviceController.get("", (_req: Request, res: Response) => {
    deviceService.getAllDevice()
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8001 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8001)
        })
})

deviceController.get("/:node", (req: Request, res: Response) => {
    deviceService.getDevice(req.params.node)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8001 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8001)
        })
})

deviceController.put("", (req: Request, res: Response) => {
    routineService.updateDeviceState(req.body.device, req.body.state)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8002 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8002)
        })
})

deviceController.put("/:id", (req: Request, res: Response) => {
    deviceService.updateInputState(req.params.id, req.body.state)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8006 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8006)
        })
})

export default deviceController