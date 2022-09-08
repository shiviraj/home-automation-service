import {PiClient} from "raspberrypi-db";
import logger from "../logger/logger";
import {DB_NAME, DB_URL} from "../config/constant";

const client = new PiClient(DB_URL)

client.connect()
    .then(() => logger.info({message: "Successful connected with db", data: {url: DB_URL}}))
    .catch((err) => logger.error({errorCode: "", errorMessage: "Failed to connect with db", details: err}))

export const db = client.db(DB_NAME)