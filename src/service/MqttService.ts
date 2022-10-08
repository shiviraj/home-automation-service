import logger, {ErrorLog} from "../logger/logger";
import MQTTTopic from "../domain/MQTTTopic";
import DeviceService from "./DeviceService";
import RoutineService from "./routine/RoutineService";
import Device from "../domain/Device";
import HAErrors from "../error/HAErrors";
import {WSEvent, WSS} from "../websocketServer";

class MqttService {
    private routineService: RoutineService;

    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService()
        this.routineService = new RoutineService()
    }

    execute(wss: WSS) {
        return (topicName: string, buffer: Buffer) => {
            const [node, topic] = topicName.split("/")
            const payload = buffer.toString()
            switch (topic) {
                case MQTTTopic.DEVICES:
                    this.deviceService.getDevices(node)
                        .then((devices) => {
                            const message = devices.map((device: Device) => wss.createMessage(device)).join("\n")
                            wss.publishTopic(`${node}_${topic}`, message)
                        })
                    break;
                case MQTTTopic.UPDATE_STATE:
                    const [_id, ...message] = payload.split("/")
                    const state = Number(message.reverse()[0])
                    this.routineService.updateDeviceState({_id} as Device, state)
                        .then(() => this.deviceService.updateInputState(_id, state))
                        .then((data) => wss.broadcast({event: WSEvent.UPDATE_STATE, data}))
                        .catch((err) => {
                            logger.error({...HAErrors.HA8006 as ErrorLog, details: err})
                        })
                    break;
                default:
                    logger.info({message: "unknown topic"})
            }
        }
    }
}

export default MqttService