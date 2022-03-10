import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";

export class HospitalTreatmentOpened implements DomainEvent {
    constructor(public readonly treatmentId: Guid) { }
}
export class HospitalTreatmentClosed implements DomainEvent {
    constructor(public readonly treatmentId: Guid) { }
}