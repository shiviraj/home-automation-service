import Device from "../domain/Device";
import Repository from "./Repository";

const collectionName = "devices"

class DeviceRepository extends Repository<Device> {
    constructor() {
        super(collectionName, Device);
    }
}

export default DeviceRepository