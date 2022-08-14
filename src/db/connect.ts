import {PiClient} from "raspberrypi-db";
import logger from "../logger/logger";

const url = process.env.DB_URL!
const dbName = process.env.DB_NAME!
const client = new PiClient(url)
client.connect().then(() => {
        logger.info({message: "Successful connected with db", data: {url}})
    }
)
export const db = client.db(dbName)