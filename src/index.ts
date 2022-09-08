import app from "./app"
import "./db/connect"
import UserService from "./service/userService";

const port = 8080

app.listen(port, () => console.log(`home-automation-service is up on ${port}`))
UserService.initUser()