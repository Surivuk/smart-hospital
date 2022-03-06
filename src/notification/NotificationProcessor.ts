import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';

export default class NotificationProcessor {

    constructor(
    ) { }

    registerProcesses(commandChain: CommandChain) {
        commandChain
        // .registerProcessor<ProcessHealthData>(ProcessHealthData.name, async ({ monitoringId, data }) => {
        //     const monitor = await this._monitoringRepo.monitoring(monitoringId);
        //     this._eventBus.emit(new HealthDataReceived(monitor.hospitalTreatmentId, monitor.healthData(data)))
        // })
    }
}