import CommandChain from "@app/CommandChain";
import { ActivateAlarm, CreateAlarm, DeactivateAlarm, DeleteAlarm } from "@app/commands/AlarmingCommands";
import EventBus from "@app/EventBus";
import AlarmRepository from "./alarm/AlarmRepository";

export default class AlarmingProcessor {

    constructor(
        private readonly _eventBus: EventBus,
        private readonly _alarmRepository: AlarmRepository
    ) { }

    registerProcesses(commandChain: CommandChain) {
        commandChain
            .registerProcessor<CreateAlarm>(CreateAlarm.name, async ({ doctorId, treatmentId, alarm }) => {
                await this._alarmRepository.createAlarm(doctorId, treatmentId, alarm)
            })
            .registerProcessor<ActivateAlarm>(ActivateAlarm.name, async ({ alarmId }) => {
                await this._alarmRepository.activateAlarm(alarmId)
            })
            .registerProcessor<DeactivateAlarm>(DeactivateAlarm.name, async ({ alarmId }) => {
                await this._alarmRepository.deactivateAlarm(alarmId)
            })
            .registerProcessor<DeleteAlarm>(DeleteAlarm.name, async ({ alarmId }) => {
                await this._alarmRepository.deleteAlarm(alarmId)
            })
    }
}