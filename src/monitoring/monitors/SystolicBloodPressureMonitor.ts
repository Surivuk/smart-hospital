import HealthDataMonitor from "./HealthDataMonitor";

export default class SystolicBloodPressureMonitor implements HealthDataMonitor {
    isValueInRange(value: string): boolean {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return false;
        return numValue >= 50 && numValue <= 250;
    }
}