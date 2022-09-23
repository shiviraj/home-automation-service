import User from "../domain/User";
import Repository from "./repository";


const collectionName = "users"

class UserRepository extends Repository<User> {
    constructor() {
        super(collectionName);
    }

    deserialize(item: Document | null): User {
        return Object.assign(new User(), item)
    }
}

export default UserRepository