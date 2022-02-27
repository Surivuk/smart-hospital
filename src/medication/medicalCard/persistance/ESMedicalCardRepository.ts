import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import { EventStoreDBClient, FORWARDS, START } from "@eventstore/db-client";
import MedicalCard from "../MedicalCard";
import MedicalCardRepository from "../MedicalCardRepository";
import { MedicalCardEvents, MedicalCardEventStore } from "./MedicalCardEventStore";

export class ESMedicalCardRepositoryError extends Error {
    constructor(message: string) {
        super(`[ESMedicalCardRepository] Error - ${message}`);
    }
}

export default class ESMedicalCardRepository implements MedicalCardRepository {

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: MedicalCardEventStore
    ) { }

    async medicalCard(id: Guid): Promise<MedicalCard> {
        try {
            const events = this._client.readStream<MedicalCardEvents>(this.streamName(id), { direction: FORWARDS, fromRevision: START })
            const medicalCard = new MedicalCard();
            const readEvents: EventStoreEvent[] = []
            for await (const resolvedEvent of events) {
                if (!resolvedEvent.event) continue
                readEvents.push(this._eventStore.event(resolvedEvent.event))
            }
            medicalCard.loadsFromHistory(readEvents)
            return medicalCard;
        } catch (error) {
            throw new ESMedicalCardRepositoryError(`[medicalCard] = ${error.message}`);
        }
    }
    async save(medicalCard: MedicalCard): Promise<void> {
        try {
            const events = medicalCard.uncommittedChanges().map(e => this._eventStore.eventData(e))
            await this._client.appendToStream(this.streamName(medicalCard.id), events)
        } catch (error) {
            throw new ESMedicalCardRepositoryError(`[save] - ${error.message}`);
        }
    }

    private streamName(id: Guid): string {
        return `medical-card-${id.toString()}`
    }
}