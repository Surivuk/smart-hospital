import EventBus from '@app/EventBus';
import AppSocket from '@common/webSocket/AppSocket';
import { AlarmTriggered } from '@events/AlarmingEvents';

export default class NotificationEventHandlers {

    constructor(private readonly _socket: AppSocket) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<AlarmTriggered>(AlarmTriggered.name, async ({ treatmentId, alarmId, healthData }) => {
                this._socket.sendMessage(`alarms/${alarmId}`, { treatmentId, alarmId, healthData })
            })
    }
}