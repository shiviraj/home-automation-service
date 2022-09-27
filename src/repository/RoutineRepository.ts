import Repository from "./Repository";
import Routine from "../domain/routine/Routine";

const collectionName = "routines"

class RoutineRepository extends Repository<Routine> {
    constructor() {
        super(collectionName, Routine);
    }
}

export default RoutineRepository