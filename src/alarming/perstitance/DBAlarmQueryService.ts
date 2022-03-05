import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import AlarmQueryService, { AlarmReadModel } from "../alarm/AlarmQueryService";

export class DBAlarmQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBAlarmQueryService] Error - ${message}`);
    }
}

export default class DBAlarmQueryService extends KnexConnector implements AlarmQueryService {
    async alarm(id: Guid): Promise<AlarmReadModel> {
        try {
            const alarm = await this.knex("alarm").where({ id: id.toString() })
            if (alarm.length === 0) throw new Error(`Not found alarm for provided id. Id: "${id.toString()}"`)
            const triggers = await this.knex("alarm_triggers").where({ alarm: alarm[0].id })
            return this.toAlarmReadModel(alarm[0], triggers)
        } catch (error) {
            throw new DBAlarmQueryServiceError(`[alarms] - ${error.message}`);
        }
    }
    async alarms(doctorId: Guid): Promise<AlarmReadModel[]> {
        try {
            const alarms = await this.knex("alarm").where({ doctor: doctorId.toString() })
            const triggers = await this.knex("alarm_triggers").whereIn("alarm", alarms.map(row => row.id))
            return alarms.map(alarm => this.toAlarmReadModel(alarm, triggers))
        } catch (error) {
            throw new DBAlarmQueryServiceError(`[alarms] - ${error.message}`);
        }
    }

    private toAlarmReadModel(alarm: any, triggers: any[]): AlarmReadModel {
        const myTriggers = triggers.filter(trigger => trigger.alarm === alarm.id)
        return {
            id: alarm.id,
            operator: alarm.operation,
            triggers: myTriggers.map(trigger => ({
                key: trigger.key,
                value: trigger.value,
                operation: trigger.operation,
                created_at: trigger.created_at
            })),
            active: alarm.active
        }
    }
}