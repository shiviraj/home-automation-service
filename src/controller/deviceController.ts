import express, {Request, Response} from "express";
import DeviceService from "../service/deviceService";
import logger, {ErrorLog} from "../logger/logger";
import HAErrors from "../error/HAErrors";

const deviceController = express.Router()

deviceController.get("", (_req: Request, res: Response) => {
    DeviceService.getAllDevice()
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8001 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8001)
        })
})

deviceController.get("/:node", (req: Request, res: Response) => {
    DeviceService.getDevice(req.params.node)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8001 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8001)
        })
})

deviceController.put("", (req: Request, res: Response) => {
    DeviceService.updateState(req.body.device, req.body.state)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8002 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8002)
        })
})

deviceController.put("/:id", (req: Request, res: Response) => {
    DeviceService.updateInputState(req.params.id, req.body.state)
        .then((data) => res.send(data))
        .catch((err) => {
            logger.error({...HAErrors.HA8006 as ErrorLog, details: err})
            res.status(500).send(HAErrors.HA8006)
        })
})

export default deviceController