import app from "./app"
import "./db/connect"
import Scheduler from "./scheduler/Scheduler";
import wss from "./websocketServer";

const port = 3001

const server = app.listen(port, () => console.log(`home-automation-service is up on ${port}`))
server.on('upgrade', wss.listener(app))

const scheduler = new Scheduler();
scheduler.startCron("0 * * * * *")