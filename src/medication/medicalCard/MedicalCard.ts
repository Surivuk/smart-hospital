import { AggregateRoot } from "@common/AggregateRoot";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import { ExaminationNotedToMedicalCard, MedicalCardCreated, TherapyNotedToMedicalCard, TreatmentNotedToMedicalCard } from "./MedicalCardEvents";


export default class MedicalCard extends AggregateRoot {

    static create(id: Guid, patientId: Guid): MedicalCard {
        const result = new MedicalCard()
        result.createMedicalCard(id, patientId)
        return result
    }

    noteHospitalTreatment(hospitalTreatmentId: Guid) {
        this.applyChange(new TreatmentNotedToMedicalCard(this._id, hospitalTreatmentId))
    }
    noteExamination(examinationId: Guid) {
        this.applyChange(new ExaminationNotedToMedicalCard(this._id, examinationId))
    }
    noteTherapy(therapyId: Guid) {
        this.applyChange(new TherapyNotedToMedicalCard(this._id, therapyId))
    }

    protected apply(event: EventStoreEvent): void { }

    private createMedicalCard(id: Guid, patientId: Guid) {
        this.applyChange(new MedicalCardCreated(id, patientId))
    }
}