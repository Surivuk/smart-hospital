import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";

export class TherapyCreated implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly treatmentId: Guid) { }
}
export class MedicationAddedToTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medication: MedicamentConsumption) { }
}
export class MedicationRemovedFromTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicationId: Guid) { }
}