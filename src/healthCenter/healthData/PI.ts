import HealthData from "./HealthData";

export default class PI extends HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { super() }

    type(): string {
        return "PI";
    }
    value(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
    isNormal(): boolean {
        return this._value >= 0 && this._value <= 3;
    }
    isWarning(): boolean {
        return this._value > 3 && this._value <= 10;
    }
    isCritical(): boolean {
        return this._value > 10;
    }
}