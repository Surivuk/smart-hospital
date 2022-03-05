import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";
import { HealthData } from "@monitoring/HealthData";

export class AlarmTriggered implements DomainEvent {
    constructor(public readonly treatmentId: Guid, public readonly alarmId: Guid, public readonly healthData: HealthData) { }
}