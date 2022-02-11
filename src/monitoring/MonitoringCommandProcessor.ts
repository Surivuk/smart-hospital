import EventBus from "@app/EventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";
import Guid from "@helper/Guid";
import { HealthData } from "./HealthData";
import MonitoringRepository from "./MonitoringRepository";

export default class MonitoringCommandProcessor {

    constructor(
        private readonly _monitoringRepo: MonitoringRepository,
        private readonly _eventBus: EventBus
    ) { }

    async processHealthData(deviceId: Guid, data: HealthData): Promise<void> {
        const monitor = await this._monitoringRepo.monitoring(deviceId);
        this._eventBus.emit(new HealthDataReceived(monitor.hospitalTreatmentId, monitor.healthData(data)))
    }
}