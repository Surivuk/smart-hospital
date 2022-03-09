import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';
import { AggregateRoot } from '@common/AggregateRoot';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { MedicamentAddedToTherapy, MedicamentRemovedFromTherapy, TherapyCreated, TherapyLabelChanged } from './TherapyEvents';
import StringField from '@common/fields/StringField';
import TherapyType from './TherapyType';
import TherapyContract from './TherapyContract';

export class MedicamentAlreadyIncludedInTherapy extends Error { }
export class StaticTherapyCannotChange extends Error { constructor() { super("Static therapy cannot be changed") } }

export default class Therapy extends AggregateRoot implements TherapyContract {

    private _medicaments: Map<string, MedicamentConsumption> = new Map();

    static createDynamicTherapy(id: Guid, label: StringField): Therapy {
        const therapy = new Therapy();
        therapy.createTherapy(id, label, TherapyType.dynamic())
        return therapy;
    }
    static createStaticTherapy(id: Guid, label: StringField): Therapy {
        const therapy = new Therapy();
        therapy.createTherapy(id, label, TherapyType.static())
        return therapy;
    }
    private createTherapy(id: Guid, label: StringField, type: TherapyType) {
        this.applyChange(new TherapyCreated(id, label, type))
    }

    addMedicament(medicament: MedicamentConsumption) {
        if (this._medicaments.has(medicament.medicamentId.toString()))
            throw new MedicamentAlreadyIncludedInTherapy(`Medicament Id: "${medicament.medicamentId.toString()}"`)
        this.applyChange(new MedicamentAddedToTherapy(this.id, medicament))
    }
    addMedicaments(medicaments: MedicamentConsumption[]) {
        medicaments.forEach(medicament => this.addMedicament(medicament))
    }
    removeMedicament(medicamentId: Guid) {
        if (this._medicaments.has(medicamentId.toString()))
            this.applyChange(new MedicamentRemovedFromTherapy(this.id, medicamentId))
    }
    changeLabel(newLabel: StringField) {
        this.applyChange(new TherapyLabelChanged(this.id, newLabel))
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof TherapyCreated) this.applyTherapyCreated(event)
        if (event instanceof MedicamentAddedToTherapy) this.applyMedicamentAdded(event)
        if (event instanceof MedicamentRemovedFromTherapy) this.applyMedicamentRemovedFromTherapy(event)
    }

    private applyTherapyCreated(event: TherapyCreated) {
        this._id = event.therapyId;
    }
    private applyMedicamentAdded(event: MedicamentAddedToTherapy) {
        this._medicaments.set(event.medicament.medicamentId.toString(), event.medicament);
    }
    private applyMedicamentRemovedFromTherapy(event: MedicamentRemovedFromTherapy) {
        this._medicaments.delete(event.medicamentId.toString());
    }
}