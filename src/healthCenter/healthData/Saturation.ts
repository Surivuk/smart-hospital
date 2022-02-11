import HealthData from "./HealthData";

export default class Saturation implements HealthData {

    constructor(private readonly _timestamp: number, private readonly _value: number) { }

    type(): string {
        return "saturation";
    }
    isValid(): boolean {
        return this._value < 100 && this._value > 0;
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
    toString(): string {
        return `${this._value}`;
    }
    timestamp(): number {
        return this._timestamp;
    }
}