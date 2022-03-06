import EventBus from '@app/EventBus';
import { AlarmTriggered } from '@events/AlarmingEvents';

export default class NotificationEventHandlers {

    constructor() { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<AlarmTriggered>(AlarmTriggered.name, async ({ treatmentId, alarmId, healthData }) => {
                console.log(treatmentId, alarmId, healthData)
            })
    }
}