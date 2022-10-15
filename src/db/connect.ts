import {PiClient} from "raspberrypi-db";
import logger from "../logger/logger";
import {DB_NAME, DB_URL} from "../config/constant";

const client = new PiClient(DB_URL)

client.connect()
    .then(logger.logOnSuccess({message: "Successful connected with db", data: {url: DB_URL}}))
    .catch(logger.logOnError({errorCode: "", errorMessage: "Failed to connect with db"}))

export const db = client.db(DB_NAME)