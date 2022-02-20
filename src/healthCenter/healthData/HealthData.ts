export default abstract class HealthData {
    abstract type(): string;
    abstract value(): string;
    abstract timestamp(): number;

    abstract isNormal(): boolean;
    abstract isWarning(): boolean;
    abstract isCritical(): boolean;

    isInSameCategoryAs(data: HealthData): boolean {
        return this.isNormal() && data.isNormal() ||
            this.isWarning() && data.isWarning() ||
            this.isCritical() && data.isCritical();
    }
    hasSameTimestampAs(data: HealthData): boolean {
        return this.timestamp() === data.timestamp();
    }
    equals(data: HealthData): boolean {
        return this.type() === data.type() &&
            this.timestamp() === data.timestamp() &&
            this.value() === data.value();
    }
}