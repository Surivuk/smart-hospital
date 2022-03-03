import CommandChain from '@app/CommandChain';
import { ProcessHealthData } from '@app/commands/MonitoringCommands';
import EventBus from '@app/EventBus';
import { HealthDataReceived } from '@events/MonitoringEvents';

import MonitoringRepository from './MonitoringRepository';

export default class MonitoringProcessor {

    constructor(
        private readonly _monitoringRepo: MonitoringRepository,
        private readonly _eventBus: EventBus
    ) { }

    registerProcesses(commandChain: CommandChain) {
        commandChain
            .registerProcessor<ProcessHealthData>(ProcessHealthData.name, async ({ monitoringId, data }) => {
                const monitor = await this._monitoringRepo.monitoring(monitoringId);
                this._eventBus.emit(new HealthDataReceived(monitor.hospitalTreatmentId, monitor.healthData(data)))
            })
    }
}