import KnexConnector from "@common/db/KnexConnector";
import { HealthData } from "@monitoring/HealthData";
import Alarm from "../alarm/Alarm";
import AlarmNotificationRepository from "../alarmNotification/AlarmNotificationRepository";

export class DBAlarmNotificationRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBAlarmNotificationRepository] Error - ${message}`);
    }
}

export default class DBAlarmNotificationRepository extends KnexConnector implements AlarmNotificationRepository {
    async saveAlarmNotification(healthData: HealthData, alarms: Alarm[]): Promise<void> {
        try {
            if (alarms.length > 0)
                await this.knex("alarming.alarm_notifications").insert(alarms.map(alarm => ({
                    alarm: alarm.id.toString(),
                    data_type: healthData.type,
                    data_value: healthData.value,
                    created_at: this.knex.fn.now()
                })))
        } catch (error) {
            throw new DBAlarmNotificationRepositoryError(`[saveAlarmNotification] - ${error.message}`);
        }
    }
}