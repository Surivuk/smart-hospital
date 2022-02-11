import Guid from "@helper/Guid";
import Monitoring from "@monitoring/Monitoring";
import MonitoringRepository from "@monitoring/MonitoringRepository";

export default class MockMonitoringRepository implements MonitoringRepository {

    private _monitoring!: Monitoring;

    setMonitoring(monitoring: Monitoring): void {
        this._monitoring = monitoring;
    }

    async monitoring(id: Guid): Promise<Monitoring> {
        return this._monitoring;
    }
}