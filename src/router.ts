import express from "express";
import deviceController from "./controller/deviceController";
import userController from "./controller/userController";

const router = express.Router()
router.use("/users", userController)
router.use("/devices", deviceController)

export default router