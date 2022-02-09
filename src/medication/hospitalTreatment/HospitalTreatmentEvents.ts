import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";

export class HospitalTreatmentCreated implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly medicationCardId: Guid, public readonly doctorId: Guid) { }
}
export class TherapyAddedToHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}
export class TherapyRemovedFromHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}