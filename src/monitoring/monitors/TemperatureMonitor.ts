import HealthDataMonitor from "./HealthDataMonitor";

export default class TemperatureMonitor implements HealthDataMonitor {
    isValueInRange(value: string): boolean {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return false;
        return numValue >= 30 && numValue <= 45;
    }
}