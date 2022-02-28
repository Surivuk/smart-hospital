import { EventStoreDBClient } from "@eventstore/db-client";
import Examination from "../Examination";
import ExaminationRepository from "../ExaminationRepository";
import { ExaminationEventStore } from "./ExaminationEventStore";

export class ESExaminationRepositoryError extends Error {
    constructor(message: string) {
        super(`[ESExaminationRepository] Error - ${message}`);
    }
}

export default class ESExaminationRepository implements ExaminationRepository {

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: ExaminationEventStore
    ) { }

    async save(examination: Examination): Promise<void> {
        try {
            this._client.appendToStream(
                `examination-${examination.id.toString()}`,
                examination.uncommittedChanges().map(e => this._eventStore.eventData(e))
            )
        } catch (error) {
            throw new ESExaminationRepositoryError(`[save] - ${error.message}`)
        }
    }
}