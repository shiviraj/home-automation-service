import DeviceRepository from "../repository/deviceRepository";
import Device from "../domain/Device";

const deviceRepository = new DeviceRepository()

const DeviceService = {
    getAllDevice(): Promise<Array<Device>> {
        return deviceRepository.find({})
    },

    updateState(device: Device, value: number): Promise<Device> {
        return deviceRepository.findById(device._id!)
            .then((device: Device) => {
                const updatedDevice = device.updateValue(value)
                return deviceRepository.update(updatedDevice)
            })
    },

    getDevice(node: string) {
        return deviceRepository.find({node})
    },

    updateInputState(deviceId: string, state: number) {
        return deviceRepository.findById(deviceId)
            .then((device: Device) => {
                return deviceRepository.update(device.updateValue(state));
            })
    }
}

export default DeviceService