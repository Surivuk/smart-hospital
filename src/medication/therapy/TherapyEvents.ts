import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";

export class TherapyCreated implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly treatmentId: Guid) { }
}
export class MedicationAddedToTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medication: MedicamentConsumption) { }
}
export class MedicationRemovedFromTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicationId: Guid) { }
}