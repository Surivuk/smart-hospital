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
            const alarm = await this.knex("alarming.alarm").where({ id: id.toString() })
            if (alarm.length === 0) throw new Error(`Not found alarm for provided id. Id: "${id.toString()}"`)
            const triggers = await this.knex("alarming.alarm_triggers").where({ alarm: alarm[0].id })
            return this.toAlarmReadModel(alarm[0], triggers)
        } catch (error) {
            throw new DBAlarmQueryServiceError(`[alarm] - ${error.message}`);
        }
    }
    async alarms(doctorId: Guid): Promise<AlarmReadModel[]> {
        try {
            const alarms = await this.knex("alarming.alarm").where({ doctor: doctorId.toString() })
            const triggers = await this.knex("alarming.alarm_triggers").whereIn("alarm", alarms.map(row => row.id))
            return alarms.map(alarm => this.toAlarmReadModel(alarm, triggers))
        } catch (error) {
            throw new DBAlarmQueryServiceError(`[alarms] - ${error.message}`);
        }
    }

    private toAlarmReadModel(alarm: any, triggers: any[]): AlarmReadModel {
        const trigger = triggers.filter(trigger => trigger.alarm === alarm.id)[0]
        return {
            id: alarm.id,
            hospitalTreatment: alarm.hospital_treatment,
            name: alarm.name,
            trigger: {
                key: trigger.key,
                value: trigger.value,
                operator: trigger.operator
            },
            active: alarm.active
        }
    }
}