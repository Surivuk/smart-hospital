import EventBus from '@app/EventBus';
import AppSocket from '@common/webSocket/AppSocket';
import { AlarmTriggered } from '@events/AlarmingEvents';
import { HealthDataReceived } from '@events/MonitoringEvents';

export default class NotificationEventHandlers {

    constructor(private _socket: AppSocket) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<AlarmTriggered>(AlarmTriggered.name, async ({ treatmentId, alarmId, healthData }) => {
                this._socket.sendMessage(`alarms/${alarmId}`, { treatmentId, alarmId, healthData })
            })
            .on<HealthDataReceived>(HealthDataReceived.name, async ({ treatmentId, healthData }) => {
                this._socket.sendMessage(`hospital-treatment/${treatmentId.toString()}/data`, healthData)
            })
    }
}