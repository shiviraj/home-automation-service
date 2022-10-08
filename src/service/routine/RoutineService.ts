import RoutineRepository from "../../repository/RoutineRepository";
import Routine from "../../domain/routine/Routine";
import ConditionService from "./ConditionService";
import ActionService from "./ActionService";
import {Document} from "../../domain/Variable";
import Device from "../../domain/Device";
import DeviceService from "../DeviceService";

class RoutineService {
    private routineRepository: RoutineRepository;
    private conditionService: ConditionService;
    private actionService: ActionService;
    private deviceService: DeviceService;

    constructor() {
        this.deviceService = new DeviceService()
        this.routineRepository = new RoutineRepository()
        this.conditionService = new ConditionService()
        this.actionService = new ActionService()
    }

    executeScheduled(time: string) {
        return this.executeAvailableRoutine({trigger: {type: "SCHEDULED", at: [time]}})
    }

    updateDeviceState(device: Device, state: number): Promise<Device> {
        return this.deviceService.getRoutine(device)
            .then((routineName) => {
                if (routineName) {
                    return this.executeAvailableRoutine({name: `${routineName}_${state ? "ON" : "OFF"}`})
                        .then(() => device)
                }
                return this.deviceService.updateState(device, state)
            })
    }

    private executeAvailableRoutine(query: Document) {
        return this.findExecutableRoutines(query)
            .then((routines) => {
                routines.forEach(async (routine) => {
                    await this.updateRoutineIfAny(routine)
                    this.actionService.executeActions(routine.actions);
                })
            })
    }

    private findExecutableRoutines(query: Document): Promise<Array<Routine>> {
        return this.routineRepository.find({state: "active", ...query})
            .then((routines) => {
                return routines.filter(async (routine) => {
                    return await this.conditionService.isSatisfied(routine.conditions)
                })
            })
    }

    private async updateRoutineIfAny(routine: Routine) {
        const actions = routine.actions.filter((action) => action.type === "ROUTINE_TRIGGER_UPDATE")
        actions.forEach(action => {
            this.routineRepository.find({state: "active", ...action.identifier})
                .then((routines) => {
                    routines.forEach(routine => {
                        routine.trigger.update(action.update as { type: string, value: string })
                        this.routineRepository.save(routine)
                    })
                })
        })
    }
}

export default RoutineService