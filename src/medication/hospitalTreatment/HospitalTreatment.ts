import { AggregateRoot } from "@common/AggregateRoot";
import EventStoreEvent from "@common/EventStoreEvent";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";
import { HospitalTreatmentClosed, HospitalTreatmentCreated, TherapyAddedToHospitalTreatment, TherapyRemovedFromHospitalTreatment } from "./HospitalTreatmentEvents";

export class HospitalTreatmentError extends Error {
    constructor(message: string) {
        super(`[HospitalTreatment] Error - ${message}`);
    }
}

export default class HospitalTreatment extends AggregateRoot {

    private _therapies: Guid[] = [];
    private _closed: boolean = false;

    static create(id: Guid, medicalCardId: Guid, diagnosis: StringField): HospitalTreatment {
        const result = new HospitalTreatment()
        result.createHospitalTreatment(id, medicalCardId, diagnosis)
        return result
    }

    addTherapy(therapyId: Guid) {
        if (this._closed) throw new Error("Hospital treatment is closed. Actions not allowed")
        this.applyChange(new TherapyAddedToHospitalTreatment(this.id, therapyId))
    }
    removeTherapy(therapyId: Guid) {
        if (this._closed) throw new Error("Hospital treatment is closed. Actions not allowed")
        this.applyChange(new TherapyRemovedFromHospitalTreatment(this.id, therapyId))
    }
    closeTreatment() {
        if (!this._closed)
            this.applyChange(new HospitalTreatmentClosed(this.id))
    }

    private createHospitalTreatment(id: Guid, medicalCardId: Guid, diagnosis: StringField) {
        this.applyChange(new HospitalTreatmentCreated(id, medicalCardId, diagnosis))
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
    private applyHospitalTreatmentClosed(event: HospitalTreatmentClosed) {
        this._closed = true;
    }
    private hasTherapy(therapyId: Guid): boolean {
        return this._therapies.find(therapy => therapy.equals(therapyId)) !== undefined;
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof HospitalTreatmentCreated) this.applyHospitalTreatmentCreated(event)
        if (event instanceof TherapyAddedToHospitalTreatment) this.applyTherapyAddedToHospitalTreatment(event);
        if (event instanceof TherapyRemovedFromHospitalTreatment) this.applyRemoveMedicationFromTherapy(event);
        if (event instanceof HospitalTreatmentClosed) this.applyHospitalTreatmentClosed(event);
    }
}