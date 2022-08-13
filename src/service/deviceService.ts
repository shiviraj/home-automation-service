import {Collection, Document} from "raspberrypi-db/lib/pi/collection";

const DeviceService = {
    getAllDevice(collection: Collection): Promise<Array<Document>> {
        return collection.find({})
    }
}

export default DeviceService