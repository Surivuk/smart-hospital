import EventBus from "@app/EventBus";
import { AlarmTriggered } from "@events/AlarmingEvents";
import { HealthDataReceived } from "@events/MonitoringEvents";
import AlarmNotificationRepository from "./alarmNotification/AlarmNotificationRepository";
import AlarmRepository from "./alarm/AlarmRepository";

export default class AlarmingEventHandlers {

    constructor(
        private readonly _alarmRepository: AlarmRepository,
        private readonly _alarmNotificationRepository: AlarmNotificationRepository
    ) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<HealthDataReceived>(HealthDataReceived.name, async ({ treatmentId, healthData }) => {
                const triggeredAlarms = (await this._alarmRepository.activeAlarms(treatmentId)).filter(alarm => alarm.triggered(healthData))
                await this._alarmNotificationRepository.saveAlarmNotification(healthData, triggeredAlarms)
                triggeredAlarms.map(alarm => new AlarmTriggered(treatmentId, alarm.id, healthData)).forEach(event => eventBus.emit(event))
            })
    }
}