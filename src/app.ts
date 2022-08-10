import express, {NextFunction, Request, Response} from "express"
import {PiClient} from "raspberrypi-db"
import logger from "./logger/logger";
import router from "./router";

const url = process.env.DB_URL!
const dbName = process.env.DB_NAME!
const client: PiClient = new PiClient(url)
const db = client.db(dbName)

const app = express()
app.use(express.json())

app.get("/", (_req: Request, res: Response) => {
    res.send({message: "Hello! you have just arrived at home-automation-server"})
})

app.use((_req: Request, res: Response, next: NextFunction) => {
    res.locals.db = db
    next()
})

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info({message: "Received Request", data: {method: req.method, url: req.url}})
    const send = res.send
    res.send = function (data: any) {
        logger.info({
            message: "Response for the request",
            data: {method: req.method, url: req.url, statusCode: res.statusCode}
        })
        return send.call(this, data)
    }
    next()
})

app.use("/api", router)

app.use((_req: Request, res: Response) => {
    res.status(404).send({message: "invalid request"})
})

export default app