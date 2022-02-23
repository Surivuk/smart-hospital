import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';
import { AggregateRoot } from '@common/AggregateRoot';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { MedicationAddedToTherapy, MedicationRemovedFromTherapy, TherapyCreated } from './TherapyEvents';

export class MedicationAlreadyIncludedInTherapy extends Error { }

export default class Therapy extends AggregateRoot {

    private _medications: Map<string, MedicamentConsumption> = new Map();

    static create(id: Guid, medicalCardId: Guid): Therapy {
        const therapy = new Therapy();
        therapy.createTherapy(id, medicalCardId)
        return therapy;
    }
    private createTherapy(id: Guid, medicalCardId: Guid) {
        this.applyChange(new TherapyCreated(id, medicalCardId))
    }

    addMedication(medication: MedicamentConsumption) {
        if (this._medications.has(medication.medicamentId.toString()))
            throw new MedicationAlreadyIncludedInTherapy(`Medication Id: "${medication.medicamentId.toString()}"`)
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

    private applyTherapyCreated(event: TherapyCreated) {
        this._id = event.therapyId;
    }
    private applyMedicationAdded(event: MedicationAddedToTherapy) {
        this._medications.set(event.medication.medicamentId.toString(), event.medication);
    }
    private applyMedicationRemovedFromTherapy(event: MedicationRemovedFromTherapy) {
        this._medications.delete(event.medicationId.toString());
    }
}