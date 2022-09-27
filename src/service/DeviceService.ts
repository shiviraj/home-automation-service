import DeviceRepository from "../repository/DeviceRepository";
import Device from "../domain/Device";
import {Document} from "raspberrypi-db/lib/api/collection";

class DeviceService {
    private readonly deviceRepository: DeviceRepository;

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }

    getAllDevice(): Promise<Array<Device>> {
        return this.deviceRepository.find({})
    }

    updateState(device: Document, value: number): Promise<Device> {
        return this.deviceRepository.findById(device._id!)
            .then((device) => {
                // if (device.routine) {
                //     return this.routineService.executeByName(`${device.routine}_${value ? "ON" : "OFF"}`)
                //         .then(() => device)
                // }
                return this.deviceRepository.save(device.updateState(value))
            })
    }

    getDevice(node: string): Promise<Array<Device>> {
        return this.deviceRepository.find({node})
    }

    updateInputState(deviceId: string, state: number): Promise<Device> {
        return this.deviceRepository.findById(deviceId)
            .then((device: Device) => {
                return this.deviceRepository.save(device.updateInputValue(state));
            })
    }

    getRoutine(device: Device): Promise<string> {
        return this.deviceRepository.findById(device._id!)
            .then((device) => device.routine || "")
    }
}

export default DeviceService