import { AggregateRoot } from "@helper/AggregateRoot";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";
import { HospitalTreatmentCreated, TherapyAddedToHospitalTreatment, TherapyRemovedFromHospitalTreatment } from "./HospitalTreatmentEvents";

export class HospitalTreatmentError extends Error {
    constructor(message: string) {
        super(`[HospitalTreatment] Error - ${message}`);
    }
}

export default class HospitalTreatment extends AggregateRoot {

    private _therapies: Guid[] = [];

    static create(id: Guid, medicalCardId: Guid, doctorId: Guid): HospitalTreatment {
        const result = new HospitalTreatment()
        result.createHospitalTreatment(id, medicalCardId, doctorId)
        return result
    }

    addTherapy(therapyId: Guid) {
        this.applyChange(new TherapyAddedToHospitalTreatment(this.id, therapyId))
    }
    removeTherapy(therapyId: Guid) {
        this.applyChange(new TherapyRemovedFromHospitalTreatment(this.id, therapyId))
    }

    private createHospitalTreatment(id: Guid, medicalCardId: Guid, doctorId: Guid) {
        this.applyChange(new HospitalTreatmentCreated(id, medicalCardId, doctorId))
    }
    private applyHospitalTreatmentCreated(event: HospitalTreatmentCreated) {
        this._id = event.treatmentId
    }
    private applyTherapyAddedToHospitalTreatment(event: TherapyAddedToHospitalTreatment) {
        if (this.hasTherapy(event.therapyId))
            throw new HospitalTreatmentError(`Hospital treatment already has that therapy. Treatment: "${this._id.toString()}", Therapy: "${event.therapyId.toString()}"`)
        this._therapies.push(event.therapyId);
    }
    private applyRemoveMedicationFromTherapy(event: TherapyRemovedFromHospitalTreatment) {
        if (!this.hasTherapy(event.therapyId))
            throw new HospitalTreatmentError(`Hospital treatment does not contain that therapy. Treatment: "${this._id.toString()}", Therapy: "${event.therapyId.toString()}"`)
        this._therapies = this._therapies.filter(therapy => !therapy.equals(event.therapyId));
    }
    private hasTherapy(therapyId: Guid): boolean {
        return this._therapies.find(therapy => therapy.equals(therapyId)) !== undefined;
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof HospitalTreatmentCreated) this.applyHospitalTreatmentCreated(event)
        if (event instanceof TherapyAddedToHospitalTreatment) this.applyTherapyAddedToHospitalTreatment(event);
        if (event instanceof TherapyRemovedFromHospitalTreatment) this.applyRemoveMedicationFromTherapy(event);
    }
}