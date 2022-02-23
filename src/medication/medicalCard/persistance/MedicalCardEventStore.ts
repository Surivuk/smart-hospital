import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';
import { ExaminationNotedToMedicalCard, MedicalCardCreated, TherapyNotedToMedicalCard, TreatmentNotedToMedicalCard } from '../MedicalCardEvents';


interface EventStoreAdapter<E extends EventStoreEvent, D extends MedicalCardEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

function eventData<T extends MedicalCardEvents["type"], D extends MedicalCardEvents["data"]>(type: T, data: D): EventData {
    return jsonEvent<MedicalCardEvents>({ type, data })
}

export type MedicalCardCreatedEvent = JSONEventType<"medical-card-created", {
    medicalCardId: string;
    patientId: string;
}>;
export type TreatmentNotedToMedicalCardEvent = JSONEventType<"treatment-noted-to-medical-card", {
    medicalCardId: string;
    treatmentId: string;
}>;
export type ExaminationNotedToMedicalCardEvent = JSONEventType<"examination-noted-to-medical-card", {
    medicalCardId: string;
    examinationId: string;
}>;
export type TherapyNotedToMedicalCardEvent = JSONEventType<"therapy-noted-to-medical-card", {
    medicalCardId: string;
    therapyId: string;
}>;
export type MedicalCardEvents = MedicalCardCreatedEvent | TreatmentNotedToMedicalCardEvent | ExaminationNotedToMedicalCardEvent | TherapyNotedToMedicalCardEvent

export class MedicalCardEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof MedicalCardCreated) return this.medicalCardCreated.eventData(event);
        if (event instanceof TreatmentNotedToMedicalCard) return this.treatmentNotedToMedicalCard.eventData(event);
        if (event instanceof ExaminationNotedToMedicalCard) return this.examinationNotedToMedicalCard.eventData(event);
        if (event instanceof TherapyNotedToMedicalCard) return this.therapyNotedToMedicalCard.eventData(event);
        throw new Error();
    }
    event(event: MedicalCardEvents): EventStoreEvent {
        if (event.type === "medical-card-created") return this.medicalCardCreated.event(event.data);
        if (event.type === "treatment-noted-to-medical-card") return this.treatmentNotedToMedicalCard.event(event.data)
        if (event.type === "examination-noted-to-medical-card") return this.examinationNotedToMedicalCard.event(event.data)
        if (event.type === "therapy-noted-to-medical-card") return this.therapyNotedToMedicalCard.event(event.data)
        throw new Error();
    }

    private get medicalCardCreated(): EventStoreAdapter<MedicalCardCreated, MedicalCardCreatedEvent> {
        return {
            eventData: (event) => eventData("medical-card-created", {
                medicalCardId: event.medicalCardId.toString(),
                patientId: event.patientId.toString()
            }),
            event: (data) => new MedicalCardCreated(new Guid(data.medicalCardId), new Guid(data.patientId))
        }
    }
    private get treatmentNotedToMedicalCard(): EventStoreAdapter<TreatmentNotedToMedicalCard, TreatmentNotedToMedicalCardEvent> {
        return {
            eventData: (event) => eventData("treatment-noted-to-medical-card", {
                medicalCardId: event.medicalCardId.toString(),
                treatmentId: event.treatmentId.toString()
            }),
            event: (data) => new TreatmentNotedToMedicalCard(new Guid(data.medicalCardId), new Guid(data.treatmentId))
        }
    }
    private get examinationNotedToMedicalCard(): EventStoreAdapter<ExaminationNotedToMedicalCard, ExaminationNotedToMedicalCardEvent> {
        return {
            eventData: (event) => eventData("examination-noted-to-medical-card", {
                medicalCardId: event.medicalCardId.toString(),
                examinationId: event.examinationId.toString()
            }),
            event: (data) => new ExaminationNotedToMedicalCard(new Guid(data.medicalCardId), new Guid(data.examinationId))
        }
    }
    private get therapyNotedToMedicalCard(): EventStoreAdapter<TherapyNotedToMedicalCard, TherapyNotedToMedicalCardEvent> {
        return {
            eventData: (event) => eventData("therapy-noted-to-medical-card", {
                medicalCardId: event.medicalCardId.toString(),
                therapyId: event.therapyId.toString()
            }),
            event: (data) => new TherapyNotedToMedicalCard(new Guid(data.medicalCardId), new Guid(data.therapyId))
        }
    }
}

