import HealthData from "./HealthData";

export default class SystolicBloodPressure extends HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { super() }

    type(): string {
        return "systolic-blood-pressure";
    }
    value(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
    isNormal(): boolean {
        return this._value <= 140;
    }
    isWarning(): boolean {
        return this._value > 140 && this._value <= 160;
    }
    isCritical(): boolean {
        return this._value > 160;
    }
}