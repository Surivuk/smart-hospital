import Guid from "@common/Guid";
import Alarm from "./Alarm";

export default interface AlarmRepository {
    createAlarm(doctorId: Guid, treatmentId: Guid, alarm: Alarm): Promise<void>;
    deleteAlarm(id: Guid): Promise<void>;
    activateAlarm(id: Guid): Promise<void>;
    deactivateAlarm(id: Guid): Promise<void>;

    alarm(id: Guid): Promise<Alarm>;
    activeAlarms(treatmentId: Guid): Promise<Alarm[]>;
}