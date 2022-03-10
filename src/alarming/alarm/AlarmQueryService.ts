import Guid from "@common/Guid";

export type AlarmReadModel = {
    id: string,
    hospitalTreatment: string
    medicalCard: string
    name: string;
    trigger: {
        key: string;
        value: string;
        operator: string
    }
    active: boolean;
}

export default interface AlarmQueryService {
    alarm(id: Guid): Promise<AlarmReadModel>
    alarms(doctorId: Guid): Promise<AlarmReadModel[]>
}