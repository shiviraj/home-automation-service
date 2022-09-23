import Device from "../domain/Device";
import Repository from "./repository";

const collectionName = "devices"

class DeviceRepository extends Repository<Device> {
    constructor() {
        super(collectionName);
    }

    deserialize(item: Document | null): Device {
        return Object.assign(new Device(), item)
    }
}

export default DeviceRepository