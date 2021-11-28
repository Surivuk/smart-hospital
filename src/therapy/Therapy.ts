import MedicationConsumption from '@app/medication/MedicationConsumption';
import { AggregateRoot } from '@helper/AggregateRoot';
import EventStoreEvent from '@helper/EventStoreEvent';
import Guid from '@helper/Guid';

import { MedicationAddedToTherapy, MedicationRemovedFromTherapy, TherapyCreated } from './TherapyEvents';

export class MedicationAlreadyIncludedInTherapy extends Error { }

export default class Therapy extends AggregateRoot {

    private _medications: Map<string, MedicationConsumption> = new Map();

    static create(id: Guid): Therapy {
        const therapy = new Therapy();
        therapy.setId(id)
        return therapy;
    }
    addMedication(medication: MedicationConsumption) {
        if (this._medications.has(medication.medicationId.toString()))
            throw new MedicationAlreadyIncludedInTherapy(`Medication Id: "${medication.medicationId.toString()}"`)
        this.applyChange(new MedicationAddedToTherapy(this.id, medication))
    }
    removeMedication(medicationId: Guid) {
        if (this._medications.has(medicationId.toString()))
            this.applyChange(new MedicationRemovedFromTherapy(this.id, medicationId))
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof TherapyCreated) this.applyTherapyCreated(event)
        if (event instanceof MedicationAddedToTherapy) this.applyMedicationAdded(event)
        if (event instanceof MedicationRemovedFromTherapy) this.applyMedicationRemovedFromTherapy(event)
    }

    private setId(id: Guid) {
        this.applyChange(new TherapyCreated(id))
    }
    private applyTherapyCreated(event: TherapyCreated) {
        this._id = event.therapyId;
    }
    private applyMedicationAdded(event: MedicationAddedToTherapy) {
        this._medications.set(event.medication.medicationId.toString(), event.medication);
    }
    private applyMedicationRemovedFromTherapy(event: MedicationRemovedFromTherapy) {
        this._medications.delete(event.medicationId.toString());
    }
}