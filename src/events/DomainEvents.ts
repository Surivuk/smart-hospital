import { DomainEvent } from "@app/EventBus";
import Guid from "@common/Guid";

export class TherapyCreated implements DomainEvent {
    constructor(public readonly therapyId: Guid, public readonly treatmentId: Guid) { }
}

