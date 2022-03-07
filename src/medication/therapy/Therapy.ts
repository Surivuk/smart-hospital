import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';
import { AggregateRoot } from '@common/AggregateRoot';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { MedicamentAddedToTherapy, MedicamentRemovedFromTherapy, TherapyCreated } from './TherapyEvents';

export class MedicamentAlreadyIncludedInTherapy extends Error { }

export default class Therapy extends AggregateRoot {

    private _medicaments: Map<string, MedicamentConsumption> = new Map();

    static create(id: Guid): Therapy {
        const therapy = new Therapy();
        therapy.createTherapy(id)
        return therapy;
    }
    private createTherapy(id: Guid) {
        this.applyChange(new TherapyCreated(id))
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