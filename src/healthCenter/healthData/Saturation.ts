import HealthData from "./HealthData";

export default class Saturation extends HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { super() }

    type(): string {
        return "saturation";
    }
    value(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
    isNormal(): boolean {
        return this._value >= 95;
    }
    isWarning(): boolean {
        return this._value < 95 && this._value >= 90;
    }
    isCritical(): boolean {
        return this._value < 90;
    }
}