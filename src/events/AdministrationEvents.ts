import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";

export class PatientAdded implements DomainEvent {
    constructor(public readonly patientId: Guid) { }
}
