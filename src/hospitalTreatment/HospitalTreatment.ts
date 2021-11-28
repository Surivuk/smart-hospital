import { AggregateRoot } from "@helper/AggregateRoot";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";
import { HospitalTreatmentCreated, TherapyAddedToHospitalTreatment } from "./HospitalTreatmentEvents";


export default class HospitalTreatment extends AggregateRoot {

    static create(id: Guid, medicalCardId: Guid, doctorId: Guid): HospitalTreatment {
        const result = new HospitalTreatment()
        result.createHospitalTreatment(id, medicalCardId, doctorId)
        return result
    }
    private createHospitalTreatment(id: Guid, medicalCardId: Guid, doctorId: Guid) {
        this.applyChange(new HospitalTreatmentCreated(id, medicalCardId, doctorId))
    }
    addTherapy(therapyId: Guid) {
        this.applyChange(new TherapyAddedToHospitalTreatment(this.id, therapyId))
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof HospitalTreatmentCreated) this.applyHospitalTreatmentCreated(event)
    }

    private applyHospitalTreatmentCreated(event: HospitalTreatmentCreated) {
        this._id = event.treatmentId
    }
    // private applyTherapyAddedToHospitalTreatment(event: TherapyAddedToHospitalTreatment) { }
}