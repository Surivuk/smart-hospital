import { EventData, EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import TherapyContract from "../TherapyContract";
import TherapyRepository from "../TherapyRepository";
import { TherapyEvents, TherapyEventStore } from "./TherapyEventStore";
import Therapy from "../Therapy";
import TherapyType from "../TherapyType";
import StaticTherapyWrapper from "../StaticTherapy";

export default class ESTherapyRepository implements TherapyRepository {

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: TherapyEventStore
    ) { }

    async therapy(therapyId: Guid): Promise<TherapyContract> {
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
        const type = (loadedEvents[0] as any).type as TherapyType
        if(type.isStatic())
            return new StaticTherapyWrapper(therapy)
        return therapy
    }
    async save(therapy: TherapyContract): Promise<void> {
        await this._client.appendToStream(this.streamName(therapy.id), this.uncommittedEvents(therapy))
    }

    private streamName(therapyId: Guid): string {
        return `therapy-${therapyId.toString()}`
    }
    private uncommittedEvents(therapy: TherapyContract): EventData[] {
        return therapy.uncommittedChanges().map(event => this._eventStore.eventData(event))
    }
}