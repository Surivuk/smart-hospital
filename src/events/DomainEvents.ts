import { DomainEvent } from "@app/EventBus";
import Guid from "@helper/Guid";

export class TherapyCreated implements DomainEvent {
    constructor(public readonly therapyId: Guid, public readonly medicalCardId: Guid) { }
}