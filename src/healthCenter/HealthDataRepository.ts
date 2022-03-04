import Guid from "@common/Guid";
import HealthData from "./healthData/HealthData";

export default interface HealthDataRepository {
    save(treatmentId: Guid, healthData: HealthData[]): Promise<void>;
}