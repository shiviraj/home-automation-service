import app from "./app"
import "./db/connect"

const port = 8080

app.listen(port, () => console.log(`home-automation-service is up on ${port}`))