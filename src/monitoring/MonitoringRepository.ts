import Guid from "@common/Guid";
import Monitoring from "./Monitoring";

export default interface MonitoringRepository {
    monitoring(id: Guid): Promise<Monitoring>;
}