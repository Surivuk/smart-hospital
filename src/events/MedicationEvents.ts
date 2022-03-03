import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";

export class HospitalTreatmentOpened implements DomainEvent {
    constructor(public readonly treatmentId: Guid) { }
}