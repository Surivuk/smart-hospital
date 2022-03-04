import HealthData from "./HealthData";

export default class Temperature extends HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { super() }

    type(): string {
        return "temperature";
    }
    value(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
    isNormal(): boolean {
        return this._value >= 36 && this._value <= 37;
    }
    isWarning(): boolean {
        return (this._value > 37 && this._value < 39) || (this._value > 35 && this._value < 36);
    }
    isCritical(): boolean {
        return this._value <= 35 || this._value >= 39;
    }
}