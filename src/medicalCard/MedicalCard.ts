/*

enterHospitalTreatment
enterExamination

*/

import { AggregateRoot } from "@helper/AggregateRoot";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";


export default class MedicalCard extends AggregateRoot {


    noteHospitalTreatment(hospitalTreatmentId: Guid) { }
    noteExamination(examinationId: Guid) { }
    notePrescribedTherapy(therapyId: Guid) { }

    protected apply(event: EventStoreEvent): void {
        throw new Error("Method not implemented.");
    }



}