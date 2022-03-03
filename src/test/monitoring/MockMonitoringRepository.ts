import Guid from "@common/Guid";
import Monitoring from "@monitoring/Monitoring";
import MonitoringRepository from "@monitoring/MonitoringRepository";

export default class MockMonitoringRepository implements MonitoringRepository {
    private _monitoring!: Monitoring;

    setMonitoring(monitoring: Monitoring): void {
        this._monitoring = monitoring;
    }

    connectToFirstAvailableMonitoring(hospitalTreatmentId: Guid): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async monitoring(id: Guid): Promise<Monitoring> {
        return this._monitoring;
    }
}