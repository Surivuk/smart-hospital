import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";

export class HospitalTreatmentCreated implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly medicationCardId: Guid) { }
}
export class TherapyAddedToHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}
export class TherapyRemovedFromHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}