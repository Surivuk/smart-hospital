import Guid from "@helper/Guid";
import Monitoring from "./Monitoring";

export default interface MonitoringRepository {
    monitoring(id: Guid): Promise<Monitoring>;
}