import { HealthData } from "@monitoring/HealthData";
import Alarm from "../alarm/Alarm";

export default interface AlarmNotificationRepository {
    saveAlarmNotification(healthData: HealthData, alarms: Alarm[]): Promise<void>
}