import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import StringField from "@common/fields/StringField";

export class TherapyCreated implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly label: StringField) { }
}
export class MedicamentAddedToTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicament: MedicamentConsumption) { }
}
export class MedicamentRemovedFromTherapy implements EventStoreEvent {
    constructor(public readonly therapyId: Guid, public readonly medicamentId: Guid) { }
}