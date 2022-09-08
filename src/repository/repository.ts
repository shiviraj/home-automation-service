import {db} from "../db/connect";
import {Collection} from "raspberrypi-db/lib/pi/collection";

class Repository<S extends { _id: string | null }> {
    protected collection: Collection;

    constructor(collectionName: string) {
        this.collection = db.collection(collectionName)
    }

    find(param: Record<string, any>): Promise<Array<S>> {
        return this.collection.find(param) as Promise<Array<S>>
    }

    findOne(param: Record<string, any>): Promise<S> {
        return this.collection.findOne(param)
            .then((item) => item ? item : Promise.reject(null)) as Promise<S>
    }

    exists(param: Record<string, any>): Promise<boolean> {
        return this.find(param)
            .then((items: Array<S>) => items.length > 0)
    }

    save(item: S): Promise<S> {
        if (item._id === null) {
            return this.insertOne(item)
        }
        return this.exists({_id: item._id})
            .then((exist) => {
                return exist ? this.update(item) : this.insertOne(item)
            })
    }

    private insertOne(item: S): Promise<S> {
        return this.collection.insertOne(item) as Promise<S>
    }

    private update(item: S): Promise<S> {
        return this.collection.updateById(item._id!, item) as Promise<S>
    }
}

export default Repository