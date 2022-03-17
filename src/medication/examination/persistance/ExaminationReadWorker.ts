import KnexConnector from '@common/db/KnexConnector';
import ReadWorker from '@common/ReadWorker';
import {
    AllStreamRecordedEvent,
    EventStoreDBClient,
    eventTypeFilter,
    persistentSubscriptionToAllSettingsFromDefaults,
    START,
} from '@eventstore/db-client';


export default class ExaminationReadWorker extends KnexConnector implements ReadWorker {

    private readonly _groupName: string = "examination";

    constructor(
        private readonly _client: EventStoreDBClient
    ) { super() }

    async work(): Promise<void> {
        try {
            try {
                // await this._client.deletePersistentSubscriptionToAll(this._groupName)
                await this._client.getPersistentSubscriptionToAllInfo(this._groupName)
            } catch (error) {
                await this._client.createPersistentSubscriptionToAll(this._groupName,
                    { ...persistentSubscriptionToAllSettingsFromDefaults(), startFrom: START },
                    {
                        filter: eventTypeFilter({
                            prefixes: [
                                "examination-created",
                            ]
                        })
                    }
                )
            }
            const subscription = this._client.subscribeToPersistentSubscriptionToAll(this._groupName)

            try {
                for await (const event of subscription) {
                    if (!event.event) continue;
                    await this.handleEvent(event.event)
                    await subscription.ack(event);
                }
            } catch (error) {
                console.log(`Subscription was dropped. ${error}`);
            }
        } catch (error) {
            console.log(`[ExaminationReadWorker] - ${error.message}`)
        }
    }

    private async handleEvent(event: AllStreamRecordedEvent) {
        try {
            const id = event.streamId.split("examination-")[1]
            if (event.type === "examination-created") await this.examinationCreated(id, event.data);
        } catch (error) {
            console.log(`[READ WORKER] - [ExaminationReadWorker] - ${error.message}`)
        }

    }
    private async examinationCreated(id: string, data: any) {
        return this.knex("medication.examination").insert({ id: id, diagnosis: data.diagnosis, created_at: this.knex.fn.now() })
    }
}
