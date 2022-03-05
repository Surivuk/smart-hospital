import Guid from "@common/Guid";

export type HealthDataReadModel = {
    value: string;
    type: string;
    timestamp: string;
}

export default interface HealthDataQueryService {
    healthDataPerDate(treatmentId: Guid, date: Date): Promise<HealthDataReadModel[]> 
}