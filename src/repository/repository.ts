import {db} from "../db/connect";
import {Collection, Document} from "raspberrypi-db/lib/pi/collection";

export interface RepositoryItem<T> {
    _id?: T | null
}

abstract class Repository<S extends RepositoryItem<string>> {
    protected collection: Collection;

    protected constructor(collectionName: string) {
        this.collection = db.collection(collectionName)
    }

    find(param: Record<string, any>): Promise<Array<S>> {
        return this.collection.find(param) as Promise<Array<S>>
    }

    findOne(param: Record<string, any>): Promise<S> {
        return this.collection.findOne(param)
            .then((item) => item ? item : Promise.reject(null)) as Promise<S>
    }

    findById(id: string) {
        return this.collection.findById(id).then(this.deserialize)
    }

    exists(param: Record<string, any>): Promise<boolean> {
        return this.find(param)
            .then((items: Array<S>) => items.length > 0)
    }

    save(item: S): Promise<S> {
        if (!item._id) {
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

    abstract deserialize(item: Document | null): S
}

export default Repository