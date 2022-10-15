import RoutineRepository from "../../repository/RoutineRepository";
import Routine from "../../domain/routine/Routine";
import ConditionService from "./ConditionService";
import ActionService from "./ActionService";
import {Document} from "../../domain/Variable";
import Device from "../../domain/Device";
import DeviceService from "../DeviceService";
import logger from "../../logger/logger";

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
                return this.actionService.updateDeviceState({
                    type: "DEVICE",
                    identifier: device,
                    update: {value: state}
                }).then(() => device)
            })
    }

    private executeAvailableRoutine(query: Document) {
        return this.findExecutableRoutines(query)
            .then((routines) => {
                logger.info({message: `Got ${routines.length} executable routines`, data: {query}})
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
            .then(logger.logOnSuccess({message: `Successfully find executable routines`, data: {query}}))
            .catch(logger.logOnError({
                errorCode: "",
                errorMessage: `No executable routines found`, data: {query}
            }))
    }

    private async updateRoutineIfAny(routine: Routine) {
        const actions = routine.actions.filter((action) => action.type === "ROUTINE_TRIGGER_UPDATE")
        actions.length && logger.info({message: "Got updatable routine actions"})
        actions.forEach((action) => {
            this.routineRepository.find({state: "active", ...action.identifier})
                .then((routines) => {
                    routines.forEach((routine) => {
                        routine.trigger.update(action.update as { type: string, value: string })
                        this.routineRepository.save(routine)
                            .then(logger.logOnSuccess({
                                message: "Successfully update routine",
                                data: {routine, update: action.update}
                            }))
                            .catch(logger.logOnError({
                                errorCode: "",
                                errorMessage: "Failed to update routine",
                                data: {routine, update: action.update}
                            }))
                    })
                })
        })
    }
}

export default RoutineService