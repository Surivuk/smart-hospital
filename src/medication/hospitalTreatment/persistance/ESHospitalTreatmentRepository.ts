
import { EventData, EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import HospitalTreatment from "../HospitalTreatment";
import HospitalTreatmentRepository from "../HospitalTreatmentRepository";
import { HospitalTreatmentEvents, HospitalTreatmentEventStore } from "./HospitalTreatmentEventStore";

export default class ESHospitalTreatmentRepository implements HospitalTreatmentRepository {

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: HospitalTreatmentEventStore
    ) { }

    async treatment(treatmentId: Guid): Promise<HospitalTreatment> {
        const therapy = new HospitalTreatment()
        const loadedEvents: EventStoreEvent[] = []
        const events = this._client.readStream<HospitalTreatmentEvents>(this.streamName(treatmentId), {
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
    async save(treatment: HospitalTreatment): Promise<void> {
        await this._client.appendToStream(this.streamName(treatment.id), this.uncommittedEvents(treatment))
    }

    private streamName(treatmentId: Guid): string {
        return `hospital-treatment-${treatmentId.toString()}`
    }
    private uncommittedEvents(treatment: HospitalTreatment): EventData[] {
        return treatment.uncommittedChanges().map(event => this._eventStore.eventData(event))
    }
}