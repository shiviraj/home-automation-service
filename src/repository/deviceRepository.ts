import {db} from "../db/connect";
import Device from "../domain/Device";
import {Collection} from "raspberrypi-db/lib/pi/collection";

class DeviceRepository {
    private collectionName = "devices"
    private collection: Collection = db.collection(this.collectionName)

    find(param: Record<string, any>): Promise<Array<Device>> {
        return this.collection.find(param)
            .then(devices => devices.map(device => Object.assign(new Device(), device)))
    }

    findById(id: string): Promise<Device> {
        return this.collection.findById(id)
            .then(data => {
                if (data === null) {
                    return Promise.reject<Device>()
                }
                return Object.assign(new Device(), data)
            })

    }

    update(updatedDevice: Device) {
        return this.collection.updateById(updatedDevice._id!, updatedDevice) as Promise<Device>
    }
}

export default DeviceRepository