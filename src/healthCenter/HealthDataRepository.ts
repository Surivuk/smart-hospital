import HealthData from "./healthData/HealthData";

export default interface HealthDataRepository {
    save(healthData: HealthData[]): Promise<void>;
}