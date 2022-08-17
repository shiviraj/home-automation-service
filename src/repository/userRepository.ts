import {db} from "../db/connect";
import User from "../domain/User";
import {Collection} from "raspberrypi-db/lib/pi/collection";

class UserRepository {
    private collectionName = "users"
    private collection: Collection = db.collection(this.collectionName)

    find(param: Record<string, any>): Promise<Array<User>> {
        return this.collection.find(param) as Promise<Array<User>>
    }

    findOne(param: Record<string, any>): Promise<User> {
        return this.collection.findOne(param) as Promise<User>
    }


    findById(id: string): Promise<User> {
        return this.collection.findById(id)
            .then(data => {
                if (data === null) {
                    return Promise.reject<User>()
                }
                return Object.assign(new User(), data)
            })

    }

    update(updatedUser: User) {
        return this.collection.updateById(updatedUser._id!, updatedUser) as Promise<User>
    }

    save(user: User): Promise<User> {
        return this.collection.insertOne(user) as Promise<User>
    }
}

export default UserRepository