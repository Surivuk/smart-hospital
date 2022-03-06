import KnexConnector from "@common/db/KnexConnector";
import NotEmptyStringField from "@common/fields/NotEmptyStringField";
import Guid from "@common/Guid";
import { Knex } from "knex";
import Alarm from "../alarm/Alarm";
import AlarmOperator from "../alarm/AlarmOperator";
import AlarmRepository from "../alarm/AlarmRepository";
import AlarmTrigger from "../alarm/AlarmTrigger";
import TriggerOperation from "../alarm/TriggerOperation";

export class DBAlarmRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBAlarmRepository] Error - ${message}`);
    }
}

export default class DBAlarmRepository extends KnexConnector implements AlarmRepository {
    async createAlarm(doctorId: Guid, treatmentId: Guid, alarm: Alarm): Promise<void> {
        let trx!: Knex.Transaction
        try {
            trx = await this.knex.transaction()
            const { id, name, operator, trigger } = alarm.dto()
            await this.knex("alarm")
                .transacting(trx)
                .insert({
                    id,
                    doctor: doctorId.toString(),
                    hospital_treatment: treatmentId.toString(),
                    name,
                    operator,
                    created_at: this.knex.fn.now()
                })
            await this.knex("alarm_triggers")
                .transacting(trx)
                .insert({
                    alarm: id,
                    key: trigger.key,
                    value: trigger.value,
                    operator: trigger.operator,
                    created_at: this.knex.fn.now()
                })
            await trx.commit()
        } catch (error) {
            await trx.rollback()
            throw new DBAlarmRepositoryError(`[createAlarm] - ${error.message}`);
        }
    }
    async deleteAlarm(id: Guid): Promise<void> {
        try {
            await this.knex("alarm").where({ id: id.toString() }).delete()
        } catch (error) {
            throw new DBAlarmRepositoryError(`[deleteAlarm] - ${error.message}`);
        }
    }
    async activateAlarm(id: Guid): Promise<void> {
        try {
            await this.knex("alarm").update({ active: true, changed_active_at: this.knex.fn.now() }).where({ id: id.toString() })
        } catch (error) {
            throw new DBAlarmRepositoryError(`[activateAlarm] - ${error.message}`);
        }
    }
    async deactivateAlarm(id: Guid): Promise<void> {
        try {
            await this.knex("alarm").update({ active: false, changed_active_at: this.knex.fn.now() }).where({ id: id.toString() })
        } catch (error) {
            throw new DBAlarmRepositoryError(`[deactivateAlarm] - ${error.message}`);
        }
    }
    async alarm(id: Guid): Promise<Alarm> {
        try {
            const alarm = await this.knex("alarm").where({ id: id.toString() })
            if (alarm.length === 0) throw new Error(`Not found alarm for provided id. Id: "${id.toString()}"`)
            const triggers = await this.knex("alarm_triggers").where({ alarm: alarm[0].id });
            return this.toAlarm(alarm[0], triggers)
        } catch (error) {
            throw new DBAlarmRepositoryError(`[alarm] - ${error.message}`);
        }
    }
    async activeAlarms(treatmentId: Guid): Promise<Alarm[]> {
        try {
            const alarms = await this.knex("alarm").where({ hospital_treatment: treatmentId.toString(), active: true })
            const triggers = await this.knex("alarm_triggers").whereIn("alarm", alarms.map(alarm => alarm.id));
            return alarms.map(row => this.toAlarm(row, triggers))
        } catch (error) {
            throw new DBAlarmRepositoryError(`[alarms] - ${error.message}`);
        }
    }

    private toAlarm(alarm: any, triggers: any[]): Alarm {
        const trigger = triggers.filter(trigger => trigger.alarm === alarm.id)[0]
        return new Alarm(
            new Guid(alarm.id),
            AlarmOperator.create(alarm.operator),
            NotEmptyStringField.create(alarm.name),
            new AlarmTrigger(
                NotEmptyStringField.create(trigger.key),
                NotEmptyStringField.create(trigger.value),
                TriggerOperation.create(trigger.operator)
            )
        )
    }

}