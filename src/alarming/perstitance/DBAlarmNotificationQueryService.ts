import AlarmNotificationQueryService, {
    AlarmNotificationReadModel,
} from '@alarming/alarmNotification/AlarmNotificationQueryService';
import KnexConnector from '@common/db/KnexConnector';
import Guid from '@common/Guid';

export class DBAlarmNotificationQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBAlarmNotificationQueryService] Error - ${message}`);
    }
}

export default class DBAlarmNotificationQueryService extends KnexConnector implements AlarmNotificationQueryService {
    async notifications(alarm: Guid): Promise<AlarmNotificationReadModel[]> {
        try {
            const rows = await this.knex("alarm_notifications").where({ alarm: alarm.toString() })
            return rows.map(row => this.toNotification(row))
        } catch (error) {
            throw new DBAlarmNotificationQueryServiceError(`[notifications] - ${error.message}`);
        }
    }

    private toNotification(data: any): AlarmNotificationReadModel {
        return {
            alarm: data.alarm,
            dataType: data.data_type,
            dataValue: data.data_value,
            createdAt: data.created_at
        }
    }
}