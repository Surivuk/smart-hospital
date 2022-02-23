import { EventData, EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import Therapy from "../Therapy";
import TherapyRepository from "../TherapyRepository";
import { TherapyEvents, TherapyEventStore } from "./TherapyEventStore";

export default class ESTherapyRepository implements TherapyRepository {

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: TherapyEventStore
    ) { }

    async therapy(therapyId: Guid): Promise<Therapy> {
        const therapy = new Therapy()
        const loadedEvents: EventStoreEvent[] = []
        const events = this._client.readStream<TherapyEvents>(this.streamName(therapyId), {
            direction: FORWARDS,
            fromRevision: START,
        })
        for await (const { event } of events) {
            if (event === undefined) continue;
            loadedEvents.push(this._eventStore.event(event))
        }
        therapy.loadsFromHistory(loadedEvents)
        return therapy
    }
    async save(therapy: Therapy): Promise<void> {
        await this._client.appendToStream(this.streamName(therapy.id), this.uncommittedEvents(therapy))
    }

    private streamName(therapyId: Guid): string {
        return `therapy-${therapyId.toString()}`
    }
    private uncommittedEvents(therapy: Therapy): EventData[] {
        return therapy.uncommittedChanges().map(event => this._eventStore.eventData(event))
    }
}