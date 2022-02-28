import ConsumptionFrequency from '@medication/medicamentConsumption/ConsumptionFrequency';
import ConsumptionRoute from '@medication/medicamentConsumption/ConsumptionRoute';
import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';
import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import { MedicationAddedToTherapy, MedicationRemovedFromTherapy, TherapyCreated } from '../TherapyEvents';

interface EventStoreAdapter<E extends EventStoreEvent, D extends TherapyEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

type TherapyCreatedEvent = JSONEventType<"therapy-created", { therapyId: string }>;
type MedicationAddedToTherapyEvent = JSONEventType<"medication-added-to-therapy", {
    therapyId: string;
    medicationId: string;
    strength: number;
    amount: number;
    route: string;
    frequency: string;
}>;
type MedicationRemovedFromTherapyEvent = JSONEventType<"medication-removed-from-therapy", {
    therapyId: string;
    medicationId: string;
}>;
export type TherapyEvents = TherapyCreatedEvent | MedicationAddedToTherapyEvent | MedicationRemovedFromTherapyEvent;

export class TherapyEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof TherapyCreated) return this.therapyCreated.eventData(event);
        if (event instanceof MedicationAddedToTherapy) return this.medicationAddedToTherapy.eventData(event);
        if (event instanceof MedicationRemovedFromTherapy) return this.medicationRemovedFromTherapy.eventData(event);
        throw new Error();
    }
    event(event: TherapyEvents): EventStoreEvent {
        if (event.type === "therapy-created") return this.therapyCreated.event(event.data);
        if (event.type === "medication-added-to-therapy") return this.medicationAddedToTherapy.event(event.data)
        if (event.type === "medication-removed-from-therapy") return this.medicationRemovedFromTherapy.event(event.data)
        throw new Error();
    }

    private get therapyCreated(): EventStoreAdapter<TherapyCreated, TherapyCreatedEvent> {
        return {
            eventData: (event) => jsonEvent({ type: "therapy-created", data: { therapyId: event.therapyId.toString() } }),
            event: (data) => new TherapyCreated(new Guid(data.therapyId))
        }
    }
    private get medicationAddedToTherapy(): EventStoreAdapter<MedicationAddedToTherapy, MedicationAddedToTherapyEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "medication-added-to-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicationId: event.medication.medicamentId.toString(),
                    strength: event.medication.strength,
                    amount: event.medication.amount,
                    route: event.medication.route.toString(),
                    frequency: event.medication.frequency.toString()
                }
            }),
            event: (data) => new MedicationAddedToTherapy(new Guid(data.therapyId), new MedicamentConsumption(
                new Guid(data.therapyId),
                data.strength,
                data.amount,
                ConsumptionRoute.create(data.route),
                ConsumptionFrequency.create(data.frequency),
            ))
        }
    }
    private get medicationRemovedFromTherapy(): EventStoreAdapter<MedicationRemovedFromTherapy, MedicationRemovedFromTherapyEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "medication-removed-from-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicationId: event.medicationId.toString(),
                }
            }),
            event: (data) => new MedicationRemovedFromTherapy(new Guid(data.therapyId), new Guid(data.medicationId))
        }
    }
}

