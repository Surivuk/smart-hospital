import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import EventStoreEvent from '@helper/EventStoreEvent';
import NormalStringField from '@helper/fields/NormalStringField';
import NotEmptyStringField from '@helper/fields/NotEmptyStringField';
import Guid from '@helper/Guid';
import { ExaminationCreated, NoteAddedToExamination } from '../ExaminationEvents';


interface EventStoreAdapter<E extends EventStoreEvent, D extends ExaminationEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

function eventData<T extends ExaminationEvents["type"], D extends ExaminationEvents["data"]>(type: T, data: D): EventData {
    return jsonEvent<ExaminationEvents>({ type, data })
}

export type ExaminationCreatedEvent = JSONEventType<"examination-created", {
    examinationId: string;
    doctorId: string;
    diagnosis: string;
}>;
export type NoteAddedToExaminationEvent = JSONEventType<"note-added-to-examination", {
    examinationId: string;
    doctorId: string;
    note: string;
}>;
export type ExaminationEvents = ExaminationCreatedEvent | NoteAddedToExaminationEvent

export class ExaminationEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof ExaminationCreated) return this.medicalCardCreated.eventData(event);
        if (event instanceof NoteAddedToExamination) return this.treatmentNotedToMedicalCard.eventData(event);
        throw new Error();
    }
    event(event: ExaminationEvents): EventStoreEvent {
        if (event.type === "examination-created") return this.medicalCardCreated.event(event.data);
        if (event.type === "note-added-to-examination") return this.treatmentNotedToMedicalCard.event(event.data)
        throw new Error();
    }

    private get medicalCardCreated(): EventStoreAdapter<ExaminationCreated, ExaminationCreatedEvent> {
        return {
            eventData: (event) => eventData("examination-created", {
                examinationId: event.examinationId.toString(),
                doctorId: event.doctorId.toString(),
                diagnosis: event.diagnose.toString()
            }),
            event: (data) => new ExaminationCreated(new Guid(data.examinationId), new Guid(data.doctorId), NotEmptyStringField.create(data.diagnosis, "event-store-diagnoses"))
        }
    }
    private get treatmentNotedToMedicalCard(): EventStoreAdapter<NoteAddedToExamination, NoteAddedToExaminationEvent> {
        return {
            eventData: (event) => eventData("note-added-to-examination", {
                examinationId: event.examinationId.toString(),
                doctorId: event.doctorId.toString(),
                note: event.note.toString()
            }),
            event: (data) => new NoteAddedToExamination(new Guid(data.doctorId), new Guid(data.doctorId), NormalStringField.create(data.note))
        }
    }
}

