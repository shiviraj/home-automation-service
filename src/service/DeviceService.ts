import DeviceRepository from "../repository/DeviceRepository";
import Device from "../domain/Device";

class DeviceService {
    private readonly deviceRepository: DeviceRepository;

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }

    getAllDevice(): Promise<Array<Device>> {
        return this.deviceRepository.find({})
    }

    updateState(identifier: Record<string, any>, value: number): Promise<Device> {
        return this.findDevice(identifier)
            .then((device) => {
                return this.deviceRepository.save(device.updateState(value));
            })
    }

    getDevices(node: string): Promise<Array<Device>> {
        return this.deviceRepository.find({node})
    }

    updateInputState(deviceId: string, state: number): Promise<Device> {
        return this.deviceRepository.findById(deviceId)
            .then((device: Device) => {
                return this.deviceRepository.save(device.updateInputValue(state));
            })
    }

    getRoutine(device: Device): Promise<string | null> {
        return this.deviceRepository.findById(device._id!)
            .then((device) => device.routine)
    }

    findDevice(identifier: Record<string, any>): Promise<Device> {
        return this.deviceRepository.findOne(identifier)
    }
}

export default DeviceService