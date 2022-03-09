import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import StringField from "@common/fields/StringField";
import TherapyType from "./TherapyType";

export class TherapyCreated implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly label: StringField, public readonly type: TherapyType) { }
}
export class MedicamentAddedToTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicament: MedicamentConsumption) { }
}
export class MedicamentRemovedFromTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicamentId: Guid) { }
}
export class TherapyLabelChanged implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly label: StringField) { }
}