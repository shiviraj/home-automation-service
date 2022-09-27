import User from "../domain/User";
import Repository from "./Repository";

const collectionName = "users"

class UserRepository extends Repository<User> {
    constructor() {
        super(collectionName, User);
    }
}

export default UserRepository