import EventStoreEvent from '@common/EventStoreEvent';
import NormalStringField from '@common/fields/NormalStringField';
import Guid from '@common/Guid';
import { EventData, jsonEvent, JSONEventType } from '@eventstore/db-client';
import ConsumptionFrequency from '@medication/medicamentConsumption/ConsumptionFrequency';
import ConsumptionRoute from '@medication/medicamentConsumption/ConsumptionRoute';
import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';

import { MedicamentAddedToTherapy, MedicamentRemovedFromTherapy, TherapyCreated, TherapyLabelChanged } from '../TherapyEvents';
import TherapyType from '../TherapyType';

interface EventStoreAdapter<E extends EventStoreEvent, D extends TherapyEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

type TherapyCreatedEvent = JSONEventType<"therapy-created", { therapyId: string, label: string, type: string }>;
type MedicamentAddedToTherapyEvent = JSONEventType<"medicament-added-to-therapy", {
    therapyId: string;
    medicamentId: string;
    strength: number;
    amount: number;
    route: string;
    frequency: string;
}>;
type MedicamentRemovedFromTherapyEvent = JSONEventType<"medicament-removed-from-therapy", {
    therapyId: string;
    medicamentId: string;
}>;
type TherapyLabelChangedEvent = JSONEventType<"therapy-label-changed", {
    therapyId: string;
    label: string;
}>;
export type TherapyEvents = TherapyCreatedEvent | MedicamentAddedToTherapyEvent | MedicamentRemovedFromTherapyEvent | TherapyLabelChangedEvent;

export class TherapyEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof TherapyCreated) return this.therapyCreated.eventData(event);
        if (event instanceof MedicamentAddedToTherapy) return this.medicamentAddedToTherapy.eventData(event);
        if (event instanceof MedicamentRemovedFromTherapy) return this.medicamentRemovedFromTherapy.eventData(event);
        if (event instanceof TherapyLabelChanged) return this.therapyLabelChanged.eventData(event);

        throw new Error();
    }
    event(event: TherapyEvents): EventStoreEvent {
        if (event.type === "therapy-created") return this.therapyCreated.event(event.data);
        if (event.type === "medicament-added-to-therapy") return this.medicamentAddedToTherapy.event(event.data)
        if (event.type === "medicament-removed-from-therapy") return this.medicamentRemovedFromTherapy.event(event.data)
        if (event.type === "therapy-label-changed") return this.therapyLabelChanged.event(event.data)

        throw new Error();
    }

    private get therapyCreated(): EventStoreAdapter<TherapyCreated, TherapyCreatedEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "therapy-created", data: {
                    therapyId: event.therapyId.toString(),
                    label: event.label.toString(),
                    type: event.type.toString()
                }
            }),
            event: (data) => new TherapyCreated(new Guid(data.therapyId), NormalStringField.create(data.label), TherapyType.fromString(data.type))
        }
    }
    private get medicamentAddedToTherapy(): EventStoreAdapter<MedicamentAddedToTherapy, MedicamentAddedToTherapyEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "medicament-added-to-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicamentId: event.medicament.medicamentId.toString(),
                    strength: event.medicament.strength,
                    amount: event.medicament.amount,
                    route: event.medicament.route.toString(),
                    frequency: event.medicament.frequency.toString()
                }
            }),
            event: (data) => new MedicamentAddedToTherapy(new Guid(data.therapyId), new MedicamentConsumption(
                new Guid(data.medicamentId),
                data.strength,
                data.amount,
                ConsumptionRoute.create(data.route),
                ConsumptionFrequency.create(data.frequency),
            ))
        }
    }
    private get medicamentRemovedFromTherapy(): EventStoreAdapter<MedicamentRemovedFromTherapy, MedicamentRemovedFromTherapyEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "medicament-removed-from-therapy",
                data: {
                    therapyId: event.therapyId.toString(),
                    medicamentId: event.medicamentId.toString(),
                }
            }),
            event: (data) => new MedicamentRemovedFromTherapy(new Guid(data.therapyId), new Guid(data.medicamentId))
        }
    }
    private get therapyLabelChanged(): EventStoreAdapter<TherapyLabelChanged, TherapyLabelChangedEvent> {
        return {
            eventData: (event) => jsonEvent({
                type: "therapy-label-changed",
                data: {
                    therapyId: event.therapyId.toString(),
                    label: event.label.toString(),
                }
            }),
            event: (data) => new TherapyLabelChanged(new Guid(data.therapyId), NormalStringField.create(data.label))
        }
    }
}

