import EventStoreEvent from "@common/EventStoreEvent";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";
import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";

export default interface TherapyContract {
    id: Guid
    addMedicament(medicament: MedicamentConsumption): void
    addMedicaments(medicaments: MedicamentConsumption[]): void
    removeMedicament(medicamentId: Guid): void
    changeLabel(newLabel: StringField): void

    uncommittedChanges(): EventStoreEvent[]
    markChangesAsCommitted(): void
    loadsFromHistory(history: EventStoreEvent[]): void
} 