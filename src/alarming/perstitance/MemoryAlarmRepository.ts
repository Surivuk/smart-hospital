import Guid from "@common/Guid";
import Alarm from "../alarm/Alarm";
import AlarmRepository from "../alarm/AlarmRepository";

export default class MemoryAlarmRepository implements AlarmRepository {

    private readonly _cache: Map<string, Alarm> = new Map()

    constructor(private readonly _repo: AlarmRepository) { }

    async createAlarm(doctorId: Guid, treatmentId: Guid, alarm: Alarm): Promise<void> {
        await this._repo.createAlarm(doctorId, treatmentId, alarm)
        this._cache.set(alarm.id.toString(), alarm)
    }
    async deleteAlarm(id: Guid): Promise<void> {
        await this._repo.deleteAlarm(id)
        this._cache.delete(id.toString())
    }
    async activateAlarm(id: Guid): Promise<void> {
        await this._repo.activateAlarm(id)
        const alarm = await this._repo.alarm(id)
        this._cache.set(alarm.id.toString(), alarm)
    }
    async deactivateAlarm(id: Guid): Promise<void> {
        await this._repo.deactivateAlarm(id)
        this._cache.delete(id.toString())
    }
    async alarm(id: Guid): Promise<Alarm> {
        return await this._repo.alarm(id);
    }
    async activeAlarms(treatmentId: Guid): Promise<Alarm[]> {
        if (this._cache.size === 0) {
            const alarms = await this._repo.activeAlarms(treatmentId)
            this._cache.clear()
            alarms.forEach(alarm => this._cache.set(alarm.id.toString(), alarm))
        }
        return Array.from(this._cache.values());
    }

} 