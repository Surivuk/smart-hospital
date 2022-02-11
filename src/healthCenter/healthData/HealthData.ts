export default interface HealthData {
    type(): string;
    isValid(): boolean;
    isNormal(): boolean;
    isWarning(): boolean;
    isCritical(): boolean;
    toString(): string;
    timestamp(): number;
}