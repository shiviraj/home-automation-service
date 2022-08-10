import express from "express";
import deviceController from "./controller/deviceController";

const router = express.Router()
router.use("/devices", deviceController)

export default router