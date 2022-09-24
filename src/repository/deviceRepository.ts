import Device from "../domain/Device";
import Repository from "./repository";

const collectionName = "devices"

class DeviceRepository extends Repository<Device> {
    constructor() {
        super(collectionName, Device);
    }
}

export default DeviceRepository