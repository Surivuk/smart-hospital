import HealthDataMonitor from "./HealthDataMonitor";

export default class DiastolicBloodPressureMonitor implements HealthDataMonitor {
    isValueInRange(value: string): boolean {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return false;
        return numValue >= 0 && numValue <= 200;
    }
}