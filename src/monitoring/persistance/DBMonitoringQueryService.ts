import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import Monitoring from "@monitoring/Monitoring";
import MonitoringQueryService, { MonitoringReadModel } from "@monitoring/MonitoringQueryService";
import MonitoringRepository from "@monitoring/MonitoringRepository";
import DiastolicBloodPressureMonitor from "@monitoring/monitors/DiastolicBloodPressureMonitor";
import PIMonitor from "@monitoring/monitors/PIMonitor";
import PulseMonitor from "@monitoring/monitors/PulseMonitor";
import SPO2Monitor from "@monitoring/monitors/SPO2Monitor";
import SystolicBloodPressureMonitor from "@monitoring/monitors/SystolicBloodPressureMonitor";
import TemperatureMonitor from "@monitoring/monitors/TemperatureMonitor";

export class DBMonitoringQueryServiceError extends Error {
    constructor(message: string) {
        super(`[DBMonitoringQueryService] Error - ${message}`);
    }
}

export default class DBMonitoringQueryService extends KnexConnector implements MonitoringQueryService {
    private _table = "monitoring.monitoring_device"

    async monitoringForTreatment(id: Guid): Promise<MonitoringReadModel> {
        try {
            const rows = await this.knex(this._table).where({ hospital_treatment: id.toString() })
            if (rows.length === 0) throw new Error(`Not found monitoring device for provided treatment. Treatment: "${id.toString()}"`)
            return this.toMonitoring(rows[0]);
        } catch (error) {
            throw new DBMonitoringQueryServiceError(`[monitoringForTreatment] - ${error.message}`);
        }
    }
    async monitoringList(): Promise<MonitoringReadModel[]> {
        try {
            return (await this.knex(this._table)).map(m => this.toMonitoring(m))
        } catch (error) {
            throw new DBMonitoringQueryServiceError(`[monitoringList] - ${error.message}`);
        }
    }

    toMonitoring(row: any): MonitoringReadModel {
        return {
            id: row.id,
            hospitalTreatment: row.hospital_treatment !== null ? row.hospital_treatment : undefined,
            createdAt: row.created_at,
            modifiedAt: row.modified_at !== null ? row.modified_at : undefined,
        }
    }
}