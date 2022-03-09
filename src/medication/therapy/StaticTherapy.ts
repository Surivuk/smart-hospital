import EventStoreEvent from "@common/EventStoreEvent";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";
import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import TherapyContract from "./TherapyContract";

export class StaticTherapyChangeError extends Error {
    constructor() {
        super("Forbidden to make any changes to the static therapy");
    }
}

export default class StaticTherapyWrapper implements TherapyContract {
    constructor(private readonly _therapy: TherapyContract) { }
    get id(): Guid {
        return this._therapy.id;
    }
    addMedicament(medicament: MedicamentConsumption): void {
        throw new StaticTherapyChangeError();
    }
    addMedicaments(medicaments: MedicamentConsumption[]): void {
        throw new StaticTherapyChangeError();
    }
    removeMedicament(medicamentId: Guid): void {
        throw new StaticTherapyChangeError();
    }
    changeLabel(newLabel: StringField): void {
        throw new StaticTherapyChangeError();
    }
    uncommittedChanges(): EventStoreEvent[] {
        return this._therapy.uncommittedChanges()
    }
    markChangesAsCommitted(): void {
        this._therapy.markChangesAsCommitted()
    }
    loadsFromHistory(history: EventStoreEvent[]): void {
        this._therapy.loadsFromHistory(history)
    }

}