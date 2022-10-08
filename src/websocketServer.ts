import WebSocket from 'ws'
import {IncomingMessage} from "http";
import {Duplex} from "stream";
import {Express} from "express";
import logger from "./logger/logger";
import Device from "./domain/Device";
import MqttService from "./service/MqttService";
import mqtt, {MqttClient} from "mqtt";
import {MQTT_PASSWORD, MQTT_URL, MQTT_USERNAME} from "./config/constant";

export enum WSEvent {
    UPDATE_STATE = "UPDATE_STATE",
    ERROR = "ERROR"
}

export type WSData = {
    event: WSEvent,
    data: Record<string, any>
}

const topics = new Array(8).fill("").flatMap((_, index) => [`node-${index + 1}/devices`, `node-${index + 1}/update-state`])


export class WSS {
    private wss: WebSocket.Server<WebSocket.WebSocket>;
    private client: MqttClient;

    constructor() {
        this.wss = new WebSocket.WebSocketServer({noServer: true, path: '/websockets'})
        this.client = mqtt.connect(MQTT_URL, {
            clientId: 'MQTT_BFF',
            clean: true,
            connectTimeout: 4000,
            username: MQTT_USERNAME,
            password: MQTT_PASSWORD,
            reconnectPeriod: 1000,
        })
        this.init()
    }

    broadcast(payload: WSData) {
        this.wss.clients.forEach((client) => client.send(JSON.stringify(payload)))
        logger.info({message: "Successfully broadcast message", data: {event: payload.event}})
        return payload
    }

    broadcastAndSendToNode(payload: WSData, topic: string) {
        this.broadcast(payload)
        this.publishDevice(`${payload.data.node}_${topic}`, payload.data as Device)
    }

    listener(app: Express) {
        return (request: IncomingMessage, socket: Duplex, head: Buffer) => {
            app.locals.wss = {
                broadcast: this.broadcast.bind(this),
                broadcastAndSendToNode: this.broadcastAndSendToNode.bind(this)
            }
            this.wss.handleUpgrade(request, socket, head, (websocket: WebSocket) => {
                this.wss.emit('connection', websocket, request)
            })
        }
    }

    publishDevice(topic: string, device: Device) {
        const message = this.createMessage(device)
        this.publishTopic(topic, message)
    }

    publishTopic(topic: string, message: string) {
        this.client.publish(topic, message, {qos: 1}, (error: any) => {
            if (error) {
                return logger.error({
                    errorCode: "PUBLISH_ERROR",
                    errorMessage: `Failed to publish ${topic} to MQTT`,
                    details: error
                })
            }
            logger.info({message: `Successfully to published ${topic} to MQTT, ${message}`})
        })
    }

    createMessage(device: Device): string {
        return `${device?._id?.slice(0, 8)}/${device.mode === "OUTPUT" ? 1 : 0}/${device.type === "DIGITAL" ? 1 : 0}/${device.number}/${device.pin.toString().padStart(2, "0")}/${(this.getValue(device))}`
    }

    private init() {
        this.wss.on('connection', async (_ws: WebSocket, req: IncomingMessage) => {
            logger.info({message: "new connection established", data: {ip: req.socket.remoteAddress}})
        })

        this.client.on('connect', () => {
            this.client.subscribe(topics, {qos: 1})
            logger.info({message: `Subscribed topics ${topics}`})
            this.client.on('message', new MqttService().execute(this))
        })
    }

    private getValue(message: Device) {
        if (message.logic === "INDIRECT") {
            return message.value ? 0 : 1;
        }
        return message.value;
    }
}

class Singleton {
    private static instance: WSS;

    constructor() {
        if (!Singleton.instance) {
            Singleton.instance = new WSS()
        }
    }

    getInstance() {
        return Singleton.instance
    }
}

const wss = new Singleton().getInstance()
export default wss