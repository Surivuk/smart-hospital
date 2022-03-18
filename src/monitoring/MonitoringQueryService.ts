import Guid from "@common/Guid";

export type MonitoringReadModel = {
    id: string
    hospitalTreatment?: string;
    createdAt: string;
    modifiedAt?: string
}

export default interface MonitoringQueryService {
    monitoringForTreatment(treatment: Guid): Promise<MonitoringReadModel>;
    monitoringList(): Promise<MonitoringReadModel[]>;
}