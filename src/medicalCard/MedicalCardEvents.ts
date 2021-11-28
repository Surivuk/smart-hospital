import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";

export class MedicalCardCreated implements EventStoreEvent {
    constructor(public readonly patientId: Guid) { }
}