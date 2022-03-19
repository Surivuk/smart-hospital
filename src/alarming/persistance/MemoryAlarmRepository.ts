import Guid from "@common/Guid";
import Alarm from "../alarm/Alarm";
import AlarmRepository from "../alarm/AlarmRepository";

export default class MemoryAlarmRepository implements AlarmRepository {

    private readonly _cache: Map<string, Alarm[]> = new Map()

    constructor(private readonly _repo: AlarmRepository) { }

    async createAlarm(doctorId: Guid, alarm: Alarm): Promise<void> {
        await this._repo.createAlarm(doctorId, alarm)
        this.addAlarm(alarm);
    }
    async deleteAlarm(id: Guid): Promise<void> {
        await this._repo.deleteAlarm(id)
        this.removeAlarm(id);
    }
    async activateAlarm(id: Guid): Promise<void> {
        await this._repo.activateAlarm(id)
        this.addAlarm(await this._repo.alarm(id))
    }
    async deactivateAlarm(id: Guid): Promise<void> {
        await this._repo.deactivateAlarm(id)
        this.removeAlarm(id)
    }
    async alarm(id: Guid): Promise<Alarm> {
        return await this._repo.alarm(id);
    }
    async activeAlarms(treatmentId: Guid): Promise<Alarm[]> {
        if (this._cache.size === 0) {
            const alarms = await this._repo.activeAlarms(treatmentId)
            this._cache.clear()
            this._cache.set(treatmentId.toString(), alarms)
        }
        const alarms = this._cache.get(treatmentId.toString())
        if (alarms === undefined) return []
        else
            return Array.from(alarms as Alarm[]);
    }

    private addAlarm(alarm: Alarm) {
        const { treatmentId } = alarm.dto();
        if (this._cache.get(treatmentId)) {
            const alarms = this._cache.get(treatmentId) as Alarm[];
            alarms.push(alarm);
            this._cache.set(treatmentId, alarms);
        }
        else
            this._cache.set(treatmentId, [alarm]);
    }
    private removeAlarm(id: Guid) {

        this._cache.forEach((alarms) => {
            const index = alarms.findIndex(alarm => alarm.id.equals(id))
            if (index !== -1)
                alarms.splice(index, 1)
        })
    }
}