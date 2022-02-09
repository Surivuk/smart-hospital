import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";

export class MedicalCardCreated implements EventStoreEvent {
    constructor(public readonly medicalCardId: Guid, public readonly patientId: Guid) { }
}
export class TreatmentNotedToMedicalCard implements EventStoreEvent {
    constructor(public readonly medicalCardId: Guid, public readonly treatmentId: Guid) { }
}
export class ExaminationNotedToMedicalCard implements EventStoreEvent {
    constructor(public readonly medicalCardId: Guid, public readonly examinationId: Guid) { }
}
export class TherapyNotedToMedicalCard implements EventStoreEvent {
    constructor(public readonly medicalCardId: Guid, public readonly therapyId: Guid) { }
}