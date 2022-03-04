import HealthData from "./HealthData";

export default class DiastolicBloodPressure extends HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { super() }

    type(): string {
        return "diastolic-blood-pressure";
    }
    value(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
    isNormal(): boolean {
        return this._value <= 90;
    }
    isWarning(): boolean {
        return this._value > 90 && this._value <= 110;
    }
    isCritical(): boolean {
        return this._value > 110;
    }
}