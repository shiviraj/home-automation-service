import app from "./app"
import "./db/connect"
import Scheduler from "./scheduler/Scheduler";

const port = 8080

app.listen(port, () => console.log(`home-automation-service is up on ${port}`))

const scheduler = new Scheduler();
// console.log(scheduler)
scheduler.start().catch()
// setInterval(scheduler.start.bind(scheduler), 60000)