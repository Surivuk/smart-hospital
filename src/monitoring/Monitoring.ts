import Guid from "@helper/Guid";
import { HealthData } from "./HealthData";
import HealthDataMonitor from "./monitors/HealthDataMonitor";

export class MonitoringError extends Error {
    constructor(message: string) {
        super(`[Monitoring] Error - ${message}`);
    }
}

export default class Monitoring {

    constructor(
        public readonly id: Guid,
        public readonly hospitalTreatmentId: Guid,
        private readonly _monitors: { [key: string]: HealthDataMonitor }
    ) { }

    healthData(data: HealthData): HealthData {
        const { type, value } = data;

        if (!this.monitor(type).isValueInRange(value))
            throw new MonitoringError(`Provided health data is not in proper range. Type: "${type}", Value: "${value}"`)

        return data;
    }

    private monitor(type: string): HealthDataMonitor {
        const monitor = this._monitors[type];
        if (monitor === undefined) throw new MonitoringError(`Not supported type. Provided type: "${type}"`)
        return monitor;

    }
}