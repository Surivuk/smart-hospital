import EventStoreEvent from "@common/EventStoreEvent";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";

export class HospitalTreatmentCreated implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly diagnosis: StringField) { }
}
export class TherapyAddedToHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}
export class TherapyRemovedFromHospitalTreatment implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly therapyId: Guid) { }
}
export class HospitalTreatmentClosed implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid) { }
}