import MedicationConsumption from "@app/medication/MedicationConsumption";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";

export class TherapyCreated implements EventStoreEvent {
    constructor(public readonly therapyId: Guid) { }
}
export class MedicationAddedToTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medication: MedicationConsumption) { }
}
export class MedicationRemovedFromTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicationId: Guid) { }
}