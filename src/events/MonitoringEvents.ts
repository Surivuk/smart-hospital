import { DomainEvent } from "@app/EventBus";
import Guid from "@helper/Guid";
import { HealthData } from "@monitoring/HealthData";

export class HealthDataReceived implements DomainEvent {
    constructor(public readonly treatmentId: Guid, public readonly healthData: HealthData) { }
}