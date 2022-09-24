import {db} from "../db/connect";
import {Collection} from "raspberrypi-db/lib/pi/collection";

interface RepositoryItem {
    _id?: string | null
}

class Repository<T extends RepositoryItem> {
    protected collection: Collection<T>;
    private readonly type: { new(): T };

    constructor(collectionName: string, t: new () => T) {
        this.collection = db.collection<T>(collectionName)
        this.type = t
    }

    find(param: Record<string, any>): Promise<Array<T>> {
        return this.collection.find(param)
    }

    findOne(param: Record<string, any>): Promise<T | null> {
        return this.collection.findOne(param)
            .then((item) => item ? item : Promise.reject(null))
    }

    findById(id: string): Promise<T> {
        return this.collection.findById(id)
            .then((item) => {
                if (item === null) {
                    return Promise.reject<T>("No such item exists")
                }
                return Object.assign(new this.type(), item)
            })
    }

    exists(param: Record<string, any>): Promise<boolean> {
        return this.find(param)
            .then((items: Array<T>) => items.length > 0)
    }

    save(item: T): Promise<T> {
        if (!item._id) {
            return this.insertOne(item)
        }
        return this.update(item)
            .then((result) => {
                if (result === null)
                    return this.insertOne(item)
                return result
            })
    }

    private insertOne(item: T): Promise<T> {
        return this.collection.insertOne(item)
    }

    private update(item: T): Promise<T | null> {
        return this.collection.updateById(item._id!, item)
    }
}

export default Repository