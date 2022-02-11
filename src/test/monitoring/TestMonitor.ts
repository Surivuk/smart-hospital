import { HealthData } from "@monitoring/HealthData";
import HealthDataMonitor from "@monitoring/monitors/HealthDataMonitor";

export class TestMonitor implements HealthDataMonitor {
    isValueInRange(value: string): boolean {
        return value === "1";
    }
}

export const testData = (type: string, value: string): HealthData => ({ type, timestamp: new Date().getTime(), value })
