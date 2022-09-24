import DeviceRepository from "../repository/deviceRepository";
import Device from "../domain/Device";

class DeviceService {
    private readonly deviceRepository: DeviceRepository;

    constructor() {
        this.deviceRepository = new DeviceRepository()
    }

    getAllDevice(): Promise<Array<Device>> {
        return this.deviceRepository.find({})
    }

    updateState(device: Device, value: number): Promise<Device> {
        return this.deviceRepository.findById(device._id!)
            .then((device) => {
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
}

export default DeviceService