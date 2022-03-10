import KnexConnector from '@common/db/KnexConnector';
import ReadWorker from '@common/ReadWorker';
import {
    AllStreamRecordedEvent,
    EventStoreDBClient,
    eventTypeFilter,
    persistentSubscriptionToAllSettingsFromDefaults,
    START,
} from '@eventstore/db-client';


export default class TherapyReadWorker extends KnexConnector implements ReadWorker {

    private readonly _groupName: string = "therapy";

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
                                "therapy-created",
                                "medicament-added-to-therapy",
                                "medicament-removed-from-therapy",
                                "therapy-label-changed"
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
            console.log(`[TherapyReadWorker] - ${error.message}`)
        }
    }

    private async handleEvent(event: AllStreamRecordedEvent) {
        try {
            const id = event.streamId.split("therapy-")[1]
            if (event.type === "therapy-created") await this.therapyCreated(id, event.data);
            if (event.type === "medicament-added-to-therapy") await this.medicamentAdded(id, event.data);
            if (event.type === "medicament-removed-from-therapy") await this.medicamentRemoved(id, event.data);
            if (event.type === "therapy-label-changed") await this.labelChanged(id, event.data);
        } catch (error) {
            console.log(`[READ WORKER] - [MedicalCardReadWorker] - ${error.message}`)
        }

    }
    private async therapyCreated(id: string, data: any) {
        return this.knex("therapy").insert({ id: id, label: data.label, type: data.type, created_at: this.knex.fn.now() })
    }
    private async medicamentAdded(id: string, data: any) {
        return this.knex("therapy_medicaments").insert({
            therapy: id,
            medicament_id: data.medicamentId,
            strength: data.strength,
            amount: data.amount,
            route: data.route,
            frequency: data.frequency,
            created_at: this.knex.fn.now()
        })
    }
    private async medicamentRemoved(id: string, data: any) {
        return this.knex("therapy_medicaments").where({ therapy: id, medicament_id: data.medicamentId }).delete()
    }
    private async labelChanged(id: string, data: any) {
        await this.knex("hospital_treatment_therapies").update({ label: data.label }).where({ therapy: id })
        return this.knex("therapy").update({ label: data.label }).where({ id: id })
    }
}
