import DeviceRepository from "../repository/DeviceRepository";
import Device from "../domain/Device";
import logger from "../logger/logger";

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
                return this.deviceRepository.save(device.updateState(value))
                    .then(logger.logOnSuccess({
                        message: "Successfully update device state",
                        data: {from: device.value, to: value, device}
                    }))
                    .catch(logger.logOnError({
                        errorCode: "",
                        errorMessage: "Failed to update device state",
                        data: {from: device.value, to: value, device}
                    }))
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

    getRoutine(device: Device): Promise<string> {
        return this.deviceRepository.findById(<string>device._id)
            .then((d) => d.routine || "")
            .then(logger.logOnSuccess({message: `Successfully find routine for device ${device._id}`}))
            .catch(logger.logOnError({errorCode: "", errorMessage: `Failed to find routine for device ${device._id}`}))
    }

    findDevice(identifier: Record<string, any>): Promise<Device> {
        return this.deviceRepository.findOne(identifier)
    }
}

export default DeviceService