import Guid from "@common/Guid";

export type AlarmNotificationReadModel = {
    alarm: string,
    dataType: string;
    dataValue: string;
    createdAt: string
}

export default interface AlarmNotificationQueryService {
    notifications(alarm: Guid): Promise<AlarmNotificationReadModel[]>
}