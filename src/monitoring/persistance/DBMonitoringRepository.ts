import KnexConnector from "@common/db/KnexConnector";
import Guid from "@common/Guid";
import Monitoring from "@monitoring/Monitoring";
import MonitoringRepository from "@monitoring/MonitoringRepository";
import DiastolicBloodPressureMonitor from "@monitoring/monitors/DiastolicBloodPressureMonitor";
import PIMonitor from "@monitoring/monitors/PIMonitor";
import PulseMonitor from "@monitoring/monitors/PulseMonitor";
import SPO2Monitor from "@monitoring/monitors/SPO2Monitor";
import SystolicBloodPressureMonitor from "@monitoring/monitors/SystolicBloodPressureMonitor";
import TemperatureMonitor from "@monitoring/monitors/TemperatureMonitor";

export class DBMonitoringRepositoryError extends Error {
    constructor(message: string) {
        super(`[DBMonitoringRepository] Error - ${message}`);
    }
}

export default class DBMonitoringRepository extends KnexConnector implements MonitoringRepository {

    private _table = "monitoring.monitoring_device"

    async monitoring(id: Guid): Promise<Monitoring> {
        try {
            const rows = await this.knex(this._table).where({ id: id.toString() }).whereNot({ hospital_treatment: null })
            if (rows.length === 0) throw new Error(`Not found monitoring device for provided id. Id: "${id.toString()}"`)
            return this.toMonitoring(rows[0]);
        } catch (error) {
            throw new DBMonitoringRepositoryError(`[monitoring] - ${error.message}`);
        }
    }
    async connectToFirstAvailableMonitoring(hospitalTreatmentId: Guid): Promise<void> {
        try {
            const rows = await this.knex(this._table).where({ hospital_treatment: null }).limit(1)
            if (rows.length === 0) throw new Error(`No free monitoring devices`)
            await this.knex(this._table)
                .update({ hospital_treatment: hospitalTreatmentId.toString(), modified_at: this.knex.fn.now() })
                .where({ id: rows[0].id })
        } catch (error) {
            throw new DBMonitoringRepositoryError(`[connectToFirstAvailableDevice] - ${error.message}`);
        }
    }
    async disconnectTreatmentFormMonitoring(hospitalTreatmentId: Guid): Promise<void> {
        try {
            await this.knex(this._table).update({
                hospital_treatment: null,
                modified_at: this.knex.fn.now()
            }).where({ hospital_treatment: hospitalTreatmentId.toString() })
        } catch (error) {
            throw new DBMonitoringRepositoryError(`[disconnectTreatmentFormMonitoring] - ${error.message}`);
        }
    }

    private toMonitoring(data: any): Monitoring {
        return new Monitoring(new Guid(data.id), new Guid(data.hospital_treatment), {
            "SPO2": new SPO2Monitor(),
            "systolic-blood-pressure": new SystolicBloodPressureMonitor(),
            "diastolic-blood-pressure": new DiastolicBloodPressureMonitor(),
            PI: new PIMonitor(),
            temperature: new TemperatureMonitor(),
            pulse: new PulseMonitor()
        })
    }
}