import Guid from "@common/Guid";

export type AlarmReadModel = {
    id: string,
    operator: string;
    triggers: {
        key: string;
        value: string;
        operation: string
    }[]
    active: boolean;
}

export default interface AlarmQueryService {
    alarm(id: Guid): Promise<AlarmReadModel>
    alarms(doctorId: Guid): Promise<AlarmReadModel[]>
}