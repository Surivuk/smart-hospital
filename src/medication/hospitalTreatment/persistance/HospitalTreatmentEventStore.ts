import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { HospitalTreatmentClosed, HospitalTreatmentCreated, TherapyAddedToHospitalTreatment, TherapyRemovedFromHospitalTreatment } from '../HospitalTreatmentEvents';


interface EventStoreAdapter<E extends EventStoreEvent, D extends HospitalTreatmentEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

export type HospitalTreatmentCreatedEvent = JSONEventType<"hospital-treatment-created", { treatmentId: string; medicalCardId: string; }>;
export type TherapyAddedToHospitalTreatmentEvent = JSONEventType<"therapy-added-to-treatment", {
    treatmentId: string;
    therapyId: string;
}>;
export type TherapyRemovedFromHospitalTreatmentEvent = JSONEventType<"therapy-removed-from-treatment", {
    treatmentId: string;
    therapyId: string;
}>;
export type HospitalTreatmentClosedEvent = JSONEventType<"hospital-treatment-closed", { treatmentId: string }>;
export type HospitalTreatmentEvents =
    HospitalTreatmentCreatedEvent |
    TherapyAddedToHospitalTreatmentEvent |
    TherapyRemovedFromHospitalTreatmentEvent |
    HospitalTreatmentClosedEvent


export class HospitalTreatmentEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof HospitalTreatmentCreated) return this.treatmentCreated.eventData(event);
        if (event instanceof TherapyAddedToHospitalTreatment) return this.therapyAddedToHospitalTreatment.eventData(event);
        if (event instanceof TherapyRemovedFromHospitalTreatment) return this.therapyRemovedFromHospitalTreatment.eventData(event);
        if (event instanceof HospitalTreatmentClosed) return this.hospitalTreatmentClosed.eventData(event);
        throw new Error();
    }
    event(event: HospitalTreatmentEvents): EventStoreEvent {
        if (event.type === "hospital-treatment-created") return this.treatmentCreated.event(event.data);
        if (event.type === "therapy-added-to-treatment") return this.therapyAddedToHospitalTreatment.event(event.data)
        if (event.type === "therapy-removed-from-treatment") return this.therapyRemovedFromHospitalTreatment.event(event.data)
        if (event.type === "hospital-treatment-closed") return this.hospitalTreatmentClosed.event(event.data)
        throw new Error();
    }

    private get treatmentCreated(): EventStoreAdapter<HospitalTreatmentCreated, HospitalTreatmentCreatedEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "hospital-treatment-created",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    medicalCardId: event.medicationCardId.toString(),
                }
            }),
            event: (data) => new HospitalTreatmentCreated(new Guid(data.treatmentId), new Guid(data.medicalCardId))
        }
    }
    private get therapyAddedToHospitalTreatment(): EventStoreAdapter<TherapyAddedToHospitalTreatment, TherapyAddedToHospitalTreatmentEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "therapy-added-to-treatment",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new TherapyAddedToHospitalTreatment(new Guid(data.treatmentId), new Guid(data.therapyId))
        }
    }
    private get therapyRemovedFromHospitalTreatment(): EventStoreAdapter<TherapyRemovedFromHospitalTreatment, TherapyRemovedFromHospitalTreatmentEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "therapy-removed-from-treatment",
                data: {
                    treatmentId: event.treatmentId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new TherapyRemovedFromHospitalTreatment(new Guid(data.treatmentId), new Guid(data.therapyId))
        }
    }
    private get hospitalTreatmentClosed(): EventStoreAdapter<HospitalTreatmentClosed, HospitalTreatmentClosedEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "hospital-treatment-closed",
                data: {
                    treatmentId: event.treatmentId.toString()
                }
            }),
            event: (data) => new HospitalTreatmentClosed(new Guid(data.treatmentId))
        }
    }
}

