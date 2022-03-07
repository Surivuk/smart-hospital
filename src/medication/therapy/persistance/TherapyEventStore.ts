import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import { EventData, JSONEventType, jsonEvent } from "@eventstore/db-client";
import ConsumptionFrequency from "@medication/medicamentConsumption/ConsumptionFrequency";
import ConsumptionRoute from "@medication/medicamentConsumption/ConsumptionRoute";
import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import { MedicamentAddedToTherapy, MedicamentRemovedFromTherapy, TherapyCreated } from "../TherapyEvents";

interface EventStoreAdapter<E extends EventStoreEvent, D extends TherapyEvents> {
    eventData(event: E): EventData
    event(event: D["data"]): E
}

type TherapyCreatedEvent = JSONEventType<"therapy-created", { therapyId: string }>;
type medicamentAddedToTherapyEvent = JSONEventType<"medicament-added-to-therapy", {
    therapyId: string;
    medicamentId: string;
    strength: number;
    amount: number;
    route: string;
    frequency: string;
}>;
type medicamentRemovedFromTherapyEvent = JSONEventType<"medicament-removed-from-therapy", {
    therapyId: string;
    medicamentId: string;
}>;
export type TherapyEvents = TherapyCreatedEvent | medicamentAddedToTherapyEvent | medicamentRemovedFromTherapyEvent;

export class TherapyEventStore {
    eventData(event: EventStoreEvent): EventData {
        if (event instanceof TherapyCreated) return this.therapyCreated.eventData(event);
        if (event instanceof MedicamentAddedToTherapy) return this.medicamentAddedToTherapy.eventData(event);
        if (event instanceof MedicamentRemovedFromTherapy) return this.medicamentRemovedFromTherapy.eventData(event);
        throw new Error();
    }
    event(event: TherapyEvents): EventStoreEvent {
        if (event.type === "therapy-created") return this.therapyCreated.event(event.data);
        if (event.type === "medicament-added-to-therapy") return this.medicamentAddedToTherapy.event(event.data)
        if (event.type === "medicament-removed-from-therapy") return this.medicamentRemovedFromTherapy.event(event.data)
        throw new Error();
    }

    private get therapyCreated(): EventStoreAdapter<TherapyCreated, TherapyCreatedEvent> {
        return {
            eventData: (event) => jsonEvent({ type: "therapy-created", data: { therapyId: event.therapyId.toString() } }),
            event: (data) => new TherapyCreated(new Guid(data.therapyId))
        }
    }
    private get medicamentAddedToTherapy(): EventStoreAdapter<MedicamentAddedToTherapy, medicamentAddedToTherapyEvent> {
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
                new Guid(data.therapyId),
                data.strength,
                data.amount,
                ConsumptionRoute.create(data.route),
                ConsumptionFrequency.create(data.frequency),
            ))
        }
    }
    private get medicamentRemovedFromTherapy(): EventStoreAdapter<MedicamentRemovedFromTherapy, medicamentRemovedFromTherapyEvent> {
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
}

