import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { HospitalTreatmentCreated, TherapyAddedToHospitalTreatment } from '../HospitalTreatmentEvents';


interface EventStoreAdapter<E extends EventStoreEvent, D extends HospitalTreatmentEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

export type HospitalTreatmentCreatedEvent = JSONEventType<"hospital-treatment-created", { treatmentId: string; medicalCardId: string; }>;
export type TherapyAddedToHospitalTreatmentEvent = JSONEventType<"therapy-added-to-treatment", {
    treatmentId: string;
    therapyId: string;
}>;
export type HospitalTreatmentEvents = HospitalTreatmentCreatedEvent | TherapyAddedToHospitalTreatmentEvent

export class HospitalTreatmentEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof HospitalTreatmentCreated) return this.treatmentCreated.eventData(event);
        if (event instanceof TherapyAddedToHospitalTreatment) return this.therapyAddedToHospitalTreatment.eventData(event);
        throw new Error();
    }
    event(event: HospitalTreatmentEvents): EventStoreEvent {
        if (event.type === "hospital-treatment-created") return this.treatmentCreated.event(event.data);
        if (event.type === "therapy-added-to-treatment") return this.therapyAddedToHospitalTreatment.event(event.data)
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
                type: "therapy-added-to-treatment", data: {
                    treatmentId: event.treatmentId.toString(),
                    therapyId: event.therapyId.toString()
                }
            }),
            event: (data) => new TherapyAddedToHospitalTreatment(new Guid(data.treatmentId), new Guid(data.therapyId))
        }
    }
}

