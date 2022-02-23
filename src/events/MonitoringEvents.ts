import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";
import { HealthData } from "@monitoring/HealthData";

export class HealthDataReceived implements DomainEvent {
    constructor(public readonly treatmentId: Guid, public readonly healthData: HealthData) { }
}